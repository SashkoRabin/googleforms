"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QuestionType } from "@shared/types";
import type { Answer } from "@shared/types";
import { FormsHeader } from "@/src/components/FormsHeader";
import {
  useGetFormQuery,
  useSubmitResponseMutation,
} from "@/src/store/api/formsApi";
import styles from "./formExperience.module.css";

function getInitialAnswers(formId: string, questionIds: string[]): Record<string, Answer> {
  return questionIds.reduce<Record<string, Answer>>((accumulator, questionId) => {
    accumulator[questionId] = {
      questionId,
      value: "",
      values: [],
    };
    return accumulator;
  }, {});
}

export function FormFillPage({ formId }: { formId: string }) {
  const { data: form, isLoading, isError } = useGetFormQuery(formId);
  const [submitResponse, { isLoading: isSubmitting }] = useSubmitResponseMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  if (isLoading) {
    return (
      <main className={styles.page}>
        <FormsHeader />
        <div className={styles.shell}>
          <div className={styles.emptyState}>
            <h1 className={styles.emptyTitle}>Загружаем форму</h1>
            <p className={styles.emptyText}>Подтягиваем структуру вопросов с сервера.</p>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !form) {
    return (
      <main className={styles.page}>
        <FormsHeader />
        <div className={styles.shell}>
          <div className={styles.errorBox}>
            Не удалось открыть форму. Проверь URL или состояние сервера.
          </div>
        </div>
      </main>
    );
  }

  function ensureAnswer(questionId: string): Answer {
    return answers[questionId] ?? {
      questionId,
      value: "",
      values: [],
    };
  }

  function updateSingleValue(questionId: string, value: string) {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        ...ensureAnswer(questionId),
        questionId,
        value,
      },
    }));
  }

  function updateMultipleValue(questionId: string, option: string, checked: boolean) {
    const currentAnswer = ensureAnswer(questionId);
    const nextValues = checked
      ? [...(currentAnswer.values ?? []), option]
      : (currentAnswer.values ?? []).filter((value) => value !== option);

    setAnswers((current) => ({
      ...current,
      [questionId]: {
        questionId,
        values: nextValues,
      },
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) {
      return;
    }

    const nextAnswers = form.questions.map((question) => ensureAnswer(question.id));
    const hasRequiredError = form.questions.some((question) => {
      if (!question.required) {
        return false;
      }

      const answer = nextAnswers.find((item) => item.questionId === question.id);
      if (!answer) {
        return true;
      }

      if (question.type === QuestionType.CHECKBOX) {
        return !answer.values || answer.values.length === 0;
      }

      return !answer.value?.trim();
    });

    if (hasRequiredError) {
      setSubmitError("Заполни все обязательные вопросы.");
      setSubmitSuccess(false);
      return;
    }

    try {
      await submitResponse({
        formId: form.id,
        answers: nextAnswers,
      }).unwrap();

      setSubmitError(null);
      setSubmitSuccess(true);
      setAnswers(getInitialAnswers(form.id, form.questions.map((question) => question.id)));
    } catch {
      setSubmitError("Не удалось отправить ответы. Проверь, что сервер запущен.");
      setSubmitSuccess(false);
    }
  }

  return (
    <main className={styles.page}>
      <FormsHeader />

      <div className={styles.shell}>
        <section className={styles.hero}>
          {form.imageUrl ? (
            <Image
              src={form.imageUrl}
              alt=""
              width={1200}
              height={320}
              unoptimized
              className={styles.heroImage}
            />
          ) : null}
          <div className={styles.heroBody}>
            <h1 className={styles.heroTitle}>{form.title}</h1>
            {form.description ? (
              <p className={styles.heroDescription}>{form.description}</p>
            ) : null}
            <div className={styles.heroMeta}>
              <span className={styles.heroBadge}>
                {form.questions.length} {form.questions.length === 1 ? "вопрос" : "вопросов"}
              </span>
              <Link href={`/forms/${form.id}/responses`} className={styles.navLink}>
                Смотреть ответы
              </Link>
            </div>
          </div>
        </section>

        <form className={styles.content} onSubmit={handleSubmit}>
          {form.questions.map((question) => {
            const answer = ensureAnswer(question.id);

            return (
              <section key={question.id} className={styles.card}>
                <div className={styles.questionHead}>
                  <div>
                    <h2 className={styles.questionTitle}>
                      {question.title}{" "}
                      {question.required ? (
                        <span className={styles.requiredMark}>*</span>
                      ) : null}
                    </h2>
                    {question.description ? (
                      <p className={styles.questionDescription}>{question.description}</p>
                    ) : null}
                  </div>
                </div>

                {question.imageUrl ? (
                  <Image
                    src={question.imageUrl}
                    alt=""
                    width={720}
                    height={400}
                    unoptimized
                    className={styles.questionImage}
                  />
                ) : null}

                {question.type === QuestionType.TEXT ? (
                  <textarea
                    className={styles.textarea}
                    value={answer.value ?? ""}
                    onChange={(event) => updateSingleValue(question.id, event.target.value)}
                    placeholder="Твой ответ"
                  />
                ) : null}

                {question.type === QuestionType.DATE ? (
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={answer.value ?? ""}
                    onChange={(event) => updateSingleValue(question.id, event.target.value)}
                  />
                ) : null}

                {question.type === QuestionType.MULTIPLE_CHOICE ? (
                  <div className={styles.choiceList}>
                    {(question.options ?? []).map((option) => (
                      <label key={option} className={styles.choiceRow}>
                        <input
                          className={styles.choiceInput}
                          type="radio"
                          name={question.id}
                          checked={answer.value === option}
                          onChange={() => updateSingleValue(question.id, option)}
                        />
                        <span className={styles.choiceLabel}>{option}</span>
                      </label>
                    ))}
                  </div>
                ) : null}

                {question.type === QuestionType.CHECKBOX ? (
                  <div className={styles.choiceList}>
                    {(question.options ?? []).map((option) => (
                      <label key={option} className={styles.choiceRow}>
                        <input
                          className={styles.choiceInput}
                          type="checkbox"
                          checked={(answer.values ?? []).includes(option)}
                          onChange={(event) =>
                            updateMultipleValue(question.id, option, event.target.checked)
                          }
                        />
                        <span className={styles.choiceLabel}>{option}</span>
                      </label>
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}

          {submitSuccess ? (
            <div className={styles.statusBox}>Форма отправлена успешно.</div>
          ) : null}
          {submitError ? <div className={styles.errorBox}>{submitError}</div> : null}

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
              {isSubmitting ? "Отправляем..." : "Отправить"}
            </button>
            <Link href="/" className={styles.secondaryButton}>
              На главную
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

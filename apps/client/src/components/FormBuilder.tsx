"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QuestionType } from "@shared/types";
import { useCreateFormMutation } from "@/src/store/api/formsApi";
import type { DraftQuestion } from "@/src/types/formBuilder";
import { fileToDataUrl } from "@/src/utils/files";
import {
  createInitialFormValues,
  createQuestion,
  hasOptions,
  updateQuestion,
} from "@/src/utils/formBuilder";
import styles from "./formBuilder.module.css";

const questionTypeOptions = [
  { value: QuestionType.TEXT, label: "Текст" },
  { value: QuestionType.MULTIPLE_CHOICE, label: "Один из списка" },
  { value: QuestionType.CHECKBOX, label: "Несколько из списка" },
  { value: QuestionType.DATE, label: "Дата" },
];

type QuestionCardEditorProps = {
  question: DraftQuestion;
  questionIndex: number;
  isActive: boolean;
  onActivate: () => void;
  onQuestionChange: (updater: (question: DraftQuestion) => DraftQuestion) => void;
  onDuplicate: () => void;
  onRemove: () => void;
};

function QuestionImage({
  imageUrl,
  onRemove,
}: {
  imageUrl: string;
  onRemove: () => void;
}) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className={styles.questionImageWrap}>
      <Image
        src={imageUrl}
        alt=""
        width={720}
        height={400}
        unoptimized
        className={styles.questionImage}
      />
      <button type="button" className={styles.clearImageButton} onClick={onRemove}>
        Удалить изображение
      </button>
    </div>
  );
}

function QuestionPreviewByType({
  question,
  onOptionChange,
  onAddOption,
  onRemoveOption,
}: {
  question: DraftQuestion;
  onOptionChange: (optionIndex: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (optionIndex: number) => void;
}) {
  if (question.type === QuestionType.TEXT) {
    return <div className={styles.answerGhost}>Короткий текст</div>;
  }

  if (question.type === QuestionType.DATE) {
    return <div className={styles.answerGhost}>дд.мм.гггг</div>;
  }

  return (
    <div className={styles.optionsList}>
      {question.options.map((option, optionIndex) => (
        <div key={`${question.id}-${optionIndex}`} className={styles.optionRow}>
          <span className={styles.optionMarker}>
            {question.type === QuestionType.CHECKBOX ? "☐" : "◯"}
          </span>
          <input
            className={styles.optionInput}
            placeholder={`Вариант ${optionIndex + 1}`}
            value={option}
            onChange={(event) => onOptionChange(optionIndex, event.target.value)}
          />
          <button
            type="button"
            className={styles.inlineIconButton}
            onClick={() => onRemoveOption(optionIndex)}
            aria-label={`Удалить вариант ${optionIndex + 1}`}
          >
            ×
          </button>
        </div>
      ))}

      <button type="button" className={styles.linkButton} onClick={onAddOption}>
        Добавить вариант
      </button>
    </div>
  );
}

function QuestionCardEditor({
  question,
  questionIndex,
  isActive,
  onActivate,
  onQuestionChange,
  onDuplicate,
  onRemove,
}: QuestionCardEditorProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section
      className={`${styles.questionCard} ${isActive ? styles.questionCardActive : ""}`}
      onClick={onActivate}
    >
      <div className={styles.dragDots}>⋮⋮</div>

      <div className={styles.questionRow}>
        <div className={styles.questionMain}>
          <input
            className={styles.questionTitleInput}
            placeholder={`Вопрос ${questionIndex + 1}`}
            value={question.title}
            onChange={(event) =>
              onQuestionChange((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
          />

          <textarea
            className={styles.questionDescriptionInput}
            placeholder="Описание вопроса"
            value={question.description}
            onChange={(event) =>
              onQuestionChange((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
          />
        </div>

        <div className={styles.questionTypeWrap}>
          <button
            type="button"
            className={styles.imageActionButton}
            onClick={() => imageInputRef.current?.click()}
          >
            Img
          </button>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={async (event) => {
              const file = event.target.files?.[0];

              if (!file) {
                return;
              }

              const imageUrl = await fileToDataUrl(file);

              onQuestionChange((current) => ({
                ...current,
                imageUrl,
              }));

              event.target.value = "";
            }}
          />

          <select
            className={styles.typeSelect}
            value={question.type}
            onChange={(event) => {
              const nextType = event.target.value as QuestionType;

              onQuestionChange((current) => ({
                ...current,
                type: nextType,
                options: hasOptions(nextType)
                  ? current.options.length > 0
                    ? current.options
                    : [""]
                  : [],
              }));
            }}
          >
            {questionTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <QuestionImage
        imageUrl={question.imageUrl}
        onRemove={() =>
          onQuestionChange((current) => ({
            ...current,
            imageUrl: "",
          }))
        }
      />

      <QuestionPreviewByType
        question={question}
        onOptionChange={(optionIndex, value) =>
          onQuestionChange((current) => ({
            ...current,
            options: current.options.map((option, index) =>
              index === optionIndex ? value : option
            ),
          }))
        }
        onAddOption={() =>
          onQuestionChange((current) => ({
            ...current,
            options: [...current.options, ""],
          }))
        }
        onRemoveOption={(optionIndex) =>
          onQuestionChange((current) => {
            const nextOptions = current.options.filter((_, index) => index !== optionIndex);

            return {
              ...current,
              options: nextOptions.length > 0 ? nextOptions : [""],
            };
          })
        }
      />

      <div className={styles.questionFooter}>
        <div className={styles.questionFooterActions}>
          <button type="button" className={styles.inlineFooterButton} onClick={onDuplicate}>
            Дублировать
          </button>
          <button type="button" className={styles.inlineFooterButton} onClick={onRemove}>
            Удалить
          </button>
        </div>

        <label className={styles.requiredToggle}>
          <span>Обязательный вопрос</span>
          <input
            type="checkbox"
            checked={question.required}
            onChange={(event) =>
              onQuestionChange((current) => ({
                ...current,
                required: event.target.checked,
              }))
            }
          />
        </label>
      </div>
    </section>
  );
}

export function FormBuilder() {
  const router = useRouter();
  const [createForm, { isLoading }] = useCreateFormMutation();
  const [values, setValues] = useState(createInitialFormValues);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const formImageInputRef = useRef<HTMLInputElement | null>(null);

  function changeQuestion(
    questionId: string,
    updater: (question: DraftQuestion) => DraftQuestion
  ) {
    setValues((current) => ({
      ...current,
      questions: updateQuestion(current.questions, questionId, updater),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = values.title.trim();

    if (!title) {
      setErrorMessage("У формы должен быть заголовок.");
      return;
    }

    const questions = values.questions.map((question) => ({
      title: question.title.trim(),
      description: question.description.trim() || undefined,
      type: question.type,
      options: hasOptions(question.type)
        ? question.options.map((option) => option.trim()).filter(Boolean)
        : undefined,
      imageUrl: question.imageUrl || undefined,
      required: question.required,
    }));

    if (questions.some((question) => !question.title)) {
      setErrorMessage("У каждого вопроса должен быть текст.");
      return;
    }

    if (
      questions.some(
        (question) =>
          (question.type === QuestionType.MULTIPLE_CHOICE ||
            question.type === QuestionType.CHECKBOX) &&
          (!question.options || question.options.length === 0)
      )
    ) {
      setErrorMessage("У вопросов с вариантами должен быть хотя бы один вариант ответа.");
      return;
    }

    setErrorMessage(null);

    try {
      const form = await createForm({
        title,
        description: values.description.trim() || undefined,
        imageUrl: values.imageUrl || undefined,
        questions,
      }).unwrap();

      router.push(`/?created=${form.id}`);
    } catch {
      setErrorMessage("Не удалось сохранить форму. Проверь, что сервер запущен.");
    }
  }

  function addQuestion() {
    const nextQuestion = createQuestion(QuestionType.MULTIPLE_CHOICE);

    setValues((current) => ({
      ...current,
      questions: [...current.questions, nextQuestion],
    }));

    setActiveQuestionId(nextQuestion.id);
  }

  return (
    <main className={styles.page}>
      <header className={styles.editorHeader}>
        <div className={styles.editorBrand}>
          <Link href="/" className={styles.brandMark} aria-label="На главную">
            F
          </Link>

          <input
            className={styles.headerTitleInput}
            value={values.title}
            placeholder="Новая форма"
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
          />
        </div>

        <div className={styles.headerActions}>
          <Link href="/" className={styles.headerGhostButton}>
            Назад
          </Link>
          <button
            type="submit"
            form="form-builder"
            className={styles.publishButton}
            disabled={isLoading}
          >
            {isLoading ? "Сохраняем..." : "Опубликовать"}
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <form id="form-builder" className={styles.canvas} onSubmit={handleSubmit}>
          <section className={styles.titleCard}>
            {values.imageUrl ? (
              <div className={styles.coverWrap}>
                <Image
                  src={values.imageUrl}
                  alt=""
                  width={1200}
                  height={320}
                  unoptimized
                  className={styles.coverImage}
                />
                <button
                  type="button"
                  className={styles.clearImageButton}
                  onClick={() =>
                    setValues((current) => ({
                      ...current,
                      imageUrl: "",
                    }))
                  }
                >
                  Удалить обложку
                </button>
              </div>
            ) : null}

            <div className={styles.titleCardBody}>
              <input
                className={styles.titleInput}
                placeholder="Новая форма"
                value={values.title}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
              />

              <textarea
                className={styles.descriptionInput}
                placeholder="Описание"
                value={values.description}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />

              <div className={styles.titleActions}>
                <button
                  type="button"
                  className={styles.subtleButton}
                  onClick={() => formImageInputRef.current?.click()}
                >
                  Добавить обложку
                </button>

                <input
                  ref={formImageInputRef}
                  type="file"
                  accept="image/*"
                  className={styles.hiddenInput}
                  onChange={async (event) => {
                    const file = event.target.files?.[0];

                    if (!file) {
                      return;
                    }

                    const imageUrl = await fileToDataUrl(file);

                    setValues((current) => ({
                      ...current,
                      imageUrl,
                    }));

                    event.target.value = "";
                  }}
                />
              </div>
            </div>
          </section>

          {values.questions.length === 0 ? (
            <section className={styles.emptyCard}>
              <h2 className={styles.emptyTitle}>Добавь первый вопрос</h2>
              <p className={styles.emptyText}>Начни с вопроса, текста или изображения.</p>
            </section>
          ) : null}

          {values.questions.map((question, questionIndex) => (
            <QuestionCardEditor
              key={question.id}
              question={question}
              questionIndex={questionIndex}
              isActive={
                activeQuestionId === question.id ||
                (activeQuestionId === null && questionIndex === 0)
              }
              onActivate={() => setActiveQuestionId(question.id)}
              onQuestionChange={(updater) => changeQuestion(question.id, updater)}
              onDuplicate={() => {
                const nextQuestion = {
                  ...question,
                  id: `question-copy-${crypto.randomUUID()}`,
                  options: [...question.options],
                };

                setValues((current) => ({
                  ...current,
                  questions: [...current.questions, nextQuestion],
                }));

                setActiveQuestionId(nextQuestion.id);
              }}
              onRemove={() =>
                setValues((current) => ({
                  ...current,
                  questions: current.questions.filter((item) => item.id !== question.id),
                }))
              }
            />
          ))}

          {errorMessage ? <div className={styles.errorMessage}>{errorMessage}</div> : null}
        </form>

        <aside className={styles.sideToolbar}>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={addQuestion}
            title="Добавить вопрос"
            aria-label="Добавить вопрос"
          >
            +
          </button>
        </aside>
      </div>
    </main>
  );
}

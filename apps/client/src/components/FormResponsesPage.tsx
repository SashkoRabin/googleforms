"use client";

import Image from "next/image";
import Link from "next/link";
import { FormsHeader } from "@/src/components/FormsHeader";
import {
  useGetFormQuery,
  useGetResponsesQuery,
} from "@/src/store/api/formsApi";
import styles from "./formExperience.module.css";

function renderAnswerValue(value?: string, values?: string[]): string {
  if (values && values.length > 0) {
    return values.join(", ");
  }

  if (value && value.trim()) {
    return value;
  }

  return "Нет ответа";
}

export function FormResponsesPage({ formId }: { formId: string }) {
  const { data: form, isLoading: isFormLoading, isError: isFormError } = useGetFormQuery(formId);
  const {
    data: responses = [],
    isLoading: isResponsesLoading,
    isError: isResponsesError,
  } = useGetResponsesQuery(formId);

  if (isFormLoading || isResponsesLoading) {
    return (
      <main className={styles.page}>
        <FormsHeader />
        <div className={styles.shell}>
          <div className={styles.emptyState}>
            <h1 className={styles.emptyTitle}>Загружаем ответы</h1>
            <p className={styles.emptyText}>Подтягиваем форму и ее ответы с сервера.</p>
          </div>
        </div>
      </main>
    );
  }

  if (isFormError || isResponsesError || !form) {
    return (
      <main className={styles.page}>
        <FormsHeader />
        <div className={styles.shell}>
          <div className={styles.errorBox}>
            Не удалось открыть ответы по форме. Проверь URL или состояние сервера.
          </div>
        </div>
      </main>
    );
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
                {responses.length} {responses.length === 1 ? "ответ" : "ответов"}
              </span>
              <Link href={`/forms/${form.id}/fill`} className={styles.navLink}>
                Открыть форму
              </Link>
            </div>
          </div>
        </section>

        <div className={styles.content}>
          {responses.length > 0 ? (
            responses.map((response, index) => (
              <section key={response.id} className={styles.responseCard}>
                <h2 className={styles.responseTitle}>Ответ {index + 1}</h2>
                <div className={styles.answerList}>
                  {form.questions.map((question) => {
                    const answer = response.answers.find(
                      (item) => item.questionId === question.id
                    );

                    return (
                      <div key={question.id} className={styles.answerRow}>
                        <p className={styles.answerQuestion}>{question.title}</p>
                        <p className={styles.answerValue}>
                          {renderAnswerValue(answer?.value, answer?.values)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          ) : (
            <div className={styles.emptyState}>
              <h2 className={styles.emptyTitle}>Ответов пока нет</h2>
              <p className={styles.emptyText}>
                Как только кто-то отправит форму, ответы появятся здесь.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

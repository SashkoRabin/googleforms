"use client";

import Link from "next/link";
import type { Form } from "@shared/types";
import { FormsHeader } from "@/src/components/FormsHeader";
import { useGetFormsQuery } from "@/src/store/api/formsApi";
import styles from "./homePage.module.css";

const colors = ["#dfead8", "#f7e2d2", "#e7ddfb", "#ffe7d5", "#d8ebff"];

function PreviewSheet() {
  return (
    <div className={styles.formSheet}>
      <div className={styles.previewHeader} />
      <div className={`${styles.previewLine} ${styles.previewLineMedium}`} />
      <div className={`${styles.previewLine} ${styles.previewLineShort}`} />
      <div className={styles.previewQuestion} />
      <div className={styles.previewQuestion} />
      <div className={styles.previewQuestion} />
    </div>
  );
}

function getQuestionsText(form: Form) {
  const count = form.questions.length;

  if (count === 0) return "Без вопросов";
  if (count === 1) return "1 вопрос";
  if (count < 5) return `${count} вопроса`;

  return `${count} вопросов`;
}

function getColor(index: number) {
  return colors[index % colors.length];
}

function FormTile({ form, index }: { form: Form; index: number }) {
  return (
    <Link href={`/forms/${form.id}/fill`} className={styles.tileLink}>
      <div className={styles.formCard}>
        <div
          className={styles.formPreview}
          style={{ ["--preview-accent" as string]: getColor(index) }}
        >
          <PreviewSheet />
        </div>
        <span className={styles.cardCaption}>{form.title}</span>
      </div>
    </Link>
  );
}

function RecentFormCard({ form, index }: { form: Form; index: number }) {
  return (
    <div className={styles.recentCard}>
      <div
        className={styles.recentPreview}
        style={{ ["--preview-accent" as string]: getColor(index) }}
      >
        <PreviewSheet />
      </div>

      <div className={styles.recentBody}>
        <h2 className={styles.recentTitle}>{form.title}</h2>
        <p className={styles.recentMeta}>{getQuestionsText(form)}</p>

        <div className={styles.recentActions}>
          <Link
            href={`/forms/${form.id}/fill`}
            className={`${styles.recentLink} ${styles.recentLinkPrimary}`}
          >
            Открыть
          </Link>

          <Link
            href={`/forms/${form.id}/responses`}
            className={`${styles.recentLink} ${styles.recentLinkSecondary}`}
          >
            Ответы
          </Link>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const { data: forms = [], isLoading } = useGetFormsQuery();

  return (
    <main className={styles.page}>
      <FormsHeader />

      <section className={styles.templatesSection}>
        <div className={styles.container}>
          <div className={styles.templatesHeader}>
            <div className={styles.sectionTitle}>Создать форму</div>
            <div className={styles.sectionControls}>Быстрый старт</div>
          </div>

          <div className={styles.rowShell}>
            <div className={styles.row}>
              <Link href="/forms/new" className={styles.tileLink}>
                <div className={styles.createCard}>
                  <div className={styles.createPreview}>
                    <div className={styles.plus} aria-hidden="true" />
                  </div>
                  <span className={styles.cardCaption}>Новая форма</span>
                </div>
              </Link>

              {forms.map((form, index) => (
                <FormTile key={form.id} form={form} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.recentSection}>
        <div className={styles.container}>
          <div className={styles.recentHeader}>
            <div className={styles.sectionTitle}>Недавние формы</div>

            <div className={styles.recentTools}>
              <span className={styles.sortLabel}>Владелец: кто угодно</span>
              <button type="button" className={styles.iconButton} aria-label="Сетка">
                ▦
              </button>
              <button type="button" className={styles.iconButton} aria-label="Сортировка">
                A-Z
              </button>
            </div>
          </div>

          <div className={styles.recentShell}>
            {!isLoading && forms.length > 0 ? (
              <div className={styles.grid}>
                {forms.map((form, index) => (
                  <RecentFormCard key={form.id} form={form} index={index} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div>
                  <h2 className={styles.emptyTitle}>
                    {isLoading ? "Загружаем формы" : "Форм пока нет"}
                  </h2>
                  <p className={styles.emptyText}>
                    {isLoading
                      ? "Подтягиваем формы с сервера и собираем рабочее пространство."
                      : "Начни с пустой формы. После создания она появится и в верхнем ряду, и в списке недавних."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

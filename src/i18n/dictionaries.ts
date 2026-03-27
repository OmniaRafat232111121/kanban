export type Locale = "en" | "ar";

const en = {
  "nav.title": "Kanban ToDo",
  "nav.tasksOnBoard": "{count} tasks on board",
  "nav.searchPlaceholder": "Search tasks…",
  "nav.newTask": "New task",
  "nav.export": "Export JSON",
  "nav.exportAria": "Export all tasks as JSON",
  "nav.themeLight": "Light mode",
  "nav.themeDark": "Dark mode",
  "nav.themeAria": "Toggle color mode",
  "nav.langEn": "English",
  "nav.langAr": "العربية",
  "nav.langAria": "Change language",
  "nav.clearSearch": "Clear search",
  "nav.searchAria": "Search tasks",
  "nav.searchShortcutTip": "{mod}+K — focus search",
  "nav.addAria": "Add task",
  "nav.tasksChip": "{count} tasks",
  "nav.newTaskHint": "New task — Ctrl+N",

  "column.backlog": "Backlog",
  "column.in_progress": "In Progress",
  "column.review": "Review",
  "column.done": "Done",

  "column.headerDrag": "Drag header to reorder: {name}",
  "column.shown": "{n}{more} shown",
  "column.loading": "Loading…",
  "column.emptyTitle": "Nothing here yet",
  "column.emptySubtitle": "Try another search or add a task",
  "column.loadMore": "Load more",
  "column.errorLoad": "Something went wrong",

  "dialog.task.newTitle": "New task",
  "dialog.task.editTitle": "Edit task",
  "dialog.task.newSubtitle": "Add a card to your board",
  "dialog.task.editSubtitle": "Update details and column",
  "dialog.task.titleLabel": "Title",
  "dialog.task.descLabel": "Description",
  "dialog.task.descPlaceholder": "What needs to be done?",
  "dialog.task.columnLabel": "Column",
  "dialog.task.cancel": "Cancel",
  "dialog.task.save": "Save changes",
  "dialog.task.create": "Create",
  "dialog.task.saving": "Saving…",

  "dialog.delete.title": "Delete task?",
  "dialog.delete.bodyBefore": "This will remove",
  "dialog.delete.bodyAfter": "permanently. You cannot undo this.",
  "dialog.delete.cancel": "Cancel",
  "dialog.delete.confirm": "Delete",
  "dialog.delete.deleting": "Deleting…",

  "toast.taskCreated": "Task created",
  "toast.taskUpdated": "Task updated",
  "toast.taskDeleted": "Task deleted",
  "toast.duplicated": "Task duplicated",
  "toast.exportStarted": "Download started",
  "toast.exportFailed": "Export failed",
  "toast.saveFailed": "Could not save task",
  "toast.deleteFailed": "Could not delete task",
  "toast.updateFailed": "Something went wrong",
} as const;

const ar: Record<keyof typeof en, string> = {
  "nav.title": "كانبان المهام",
  "nav.tasksOnBoard": "{count} مهمة على اللوحة",
  "nav.searchPlaceholder": "ابحث في المهام…",
  "nav.newTask": "مهمة جديدة",
  "nav.export": "تصدير JSON",
  "nav.exportAria": "تصدير كل المهام كملف JSON",
  "nav.themeLight": "وضع فاتح",
  "nav.themeDark": "وضع داكن",
  "nav.themeAria": "تبديل الوضع الفاتح/الداكن",
  "nav.langEn": "English",
  "nav.langAr": "العربية",
  "nav.langAria": "تغيير اللغة",
  "nav.clearSearch": "مسح البحث",
  "nav.searchAria": "البحث في المهام",
  "nav.searchShortcutTip": "{mod}+K — التركيز على البحث",
  "nav.addAria": "إضافة مهمة",
  "nav.tasksChip": "{count} مهام",
  "nav.newTaskHint": "مهمة جديدة — Ctrl+N",

  "column.backlog": "مُتراكم",
  "column.in_progress": "قيد التنفيذ",
  "column.review": "مراجعة",
  "column.done": "منجز",

  "column.headerDrag": "اسحب العنوان لإعادة ترتيب العمود: {name}",
  "column.shown": "{n}{more} معروضة",
  "column.loading": "جاري التحميل…",
  "column.emptyTitle": "لا توجد مهام",
  "column.emptySubtitle": "جرّب بحثًا آخر أو أضف مهمة",
  "column.loadMore": "تحميل المزيد",
  "column.errorLoad": "حدث خطأ",

  "dialog.task.newTitle": "مهمة جديدة",
  "dialog.task.editTitle": "تعديل المهمة",
  "dialog.task.newSubtitle": "أضف بطاقة للوحة",
  "dialog.task.editSubtitle": "حدّث التفاصيل والعمود",
  "dialog.task.titleLabel": "العنوان",
  "dialog.task.descLabel": "الوصف",
  "dialog.task.descPlaceholder": "ما المطلوب إنجازه؟",
  "dialog.task.columnLabel": "العمود",
  "dialog.task.cancel": "إلغاء",
  "dialog.task.save": "حفظ التغييرات",
  "dialog.task.create": "إنشاء",
  "dialog.task.saving": "جاري الحفظ…",

  "dialog.delete.title": "حذف المهمة؟",
  "dialog.delete.bodyBefore": "سيتم حذف",
  "dialog.delete.bodyAfter": "نهائيًا. لا يمكن التراجع.",
  "dialog.delete.cancel": "إلغاء",
  "dialog.delete.confirm": "حذف",
  "dialog.delete.deleting": "جاري الحذف…",

  "toast.taskCreated": "تم إنشاء المهمة",
  "toast.taskUpdated": "تم تحديث المهمة",
  "toast.taskDeleted": "تم حذف المهمة",
  "toast.duplicated": "تم نسخ المهمة",
  "toast.exportStarted": "بدأ التحميل",
  "toast.exportFailed": "فشل التصدير",
  "toast.saveFailed": "تعذر حفظ المهمة",
  "toast.deleteFailed": "تعذر حذف المهمة",
  "toast.updateFailed": "حدث خطأ",
};

export const dictionaries = { en, ar } as const;

export type MessageKey = keyof typeof en;

export function translate(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  const table = dictionaries[locale];
  let s: string = table[key] ?? String(key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}

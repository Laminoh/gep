"use strict";

const STORAGE_KEY = "gep-admin-demo-v1";
const CLASS_LEVELS = ["6ème", "5ème", "4ème", "3ème", "Seconde", "Première", "Terminale"];
const demoData = {
  students: [
    { id: "s-demo-1", firstName: "Awa", lastName: "Diop", classLevel: "3ème", series: "", school: "Établissement exemple", subjects: "Mathématiques, Français", parent: "Parent exemple", phone: "77 000 00 01", district: "Quartier exemple" },
    { id: "s-demo-2", firstName: "Moussa", lastName: "Fall", classLevel: "Terminale", series: "Série à confirmer", school: "Établissement exemple", subjects: "Mathématiques, Physique", parent: "Parent exemple", phone: "77 000 00 02", district: "Quartier exemple" },
    { id: "s-demo-3", firstName: "Fatou", lastName: "Ndiaye", classLevel: "5ème", series: "", school: "Établissement exemple", subjects: "Français, Anglais", parent: "Parent exemple", phone: "77 000 00 03", district: "Quartier exemple" }
  ],
  teachers: [
    { id: "t-demo-1", firstName: "Enseignant", lastName: "Exemple A", phone: "76 000 00 01", subjects: "Mathématiques, Physique", classes: "3ème, Terminale", availability: "À confirmer avec la famille" },
    { id: "t-demo-2", firstName: "Enseignant", lastName: "Exemple B", phone: "76 000 00 02", subjects: "Français, Anglais", classes: "5ème, 3ème", availability: "À confirmer avec la famille" }
  ],
  assignments: [],
  requests: [
    { id: "r-demo-1", student: "Élève exemple 1", classLevel: "3ème", subjects: "Mathématiques", parent: "Parent exemple", phone: "77 000 00 10", courseType: "Renforcement scolaire", district: "Quartier exemple" },
    { id: "r-demo-2", student: "Élève exemple 2", classLevel: "Terminale", subjects: "Physique", parent: "Parent exemple", phone: "77 000 00 11", courseType: "À domicile", district: "Quartier exemple" }
  ]
};

const recordDefinitions = {
  students: {
    title: "élève",
    fields: [
      ["firstName", "Prénom", true], ["lastName", "Nom", true],
      ["classLevel", "Classe", true, CLASS_LEVELS], ["series", "Série (si applicable)", false],
      ["school", "Établissement", true], ["subjects", "Matières souhaitées (séparées par des virgules)", true],
      ["parent", "Nom du parent", true], ["phone", "Téléphone du parent", true],
      ["district", "Quartier", true]
    ]
  },
  teachers: {
    title: "enseignant",
    fields: [
      ["firstName", "Prénom", true], ["lastName", "Nom", true],
      ["phone", "Téléphone", true], ["subjects", "Matières enseignées (séparées par des virgules)", true],
      ["classes", "Classes prises en charge (séparées par des virgules)", true],
      ["availability", "Disponibilités", true]
    ]
  }
};

const dialog = document.getElementById("record-dialog");
const recordForm = document.getElementById("record-form");
const recordFields = document.getElementById("record-fields");
const recordError = document.getElementById("record-error");
let activeRecordType = "";
let activeRecordId = "";
let store;

function cloneDemoData() {
  return JSON.parse(JSON.stringify(demoData));
}

function reportStorageIssue(message) {
  const banner = document.querySelector(".admin-demo-banner");
  if (banner) {
    banner.innerHTML = `<strong>Problème de stockage local :</strong> ${escapeHtml(message)} Les modifications pourraient ne pas être conservées.`;
    banner.classList.add("storage-error");
  }
}

function loadStore() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      const initial = cloneDemoData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(saved);
    if (!parsed || !Array.isArray(parsed.students) || !Array.isArray(parsed.teachers) || !Array.isArray(parsed.assignments) || !Array.isArray(parsed.requests)) {
      throw new Error("Les données locales sont illisibles. Les exemples sont affichés en mémoire uniquement.");
    }
    return parsed;
  } catch (error) {
    reportStorageIssue(error instanceof Error ? error.message : "Le navigateur a refusé l’accès au stockage.");
    return cloneDemoData();
  }
}

function saveStore() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch (error) {
    reportStorageIssue(error instanceof Error ? error.message : "Le navigateur n’a pas pu enregistrer les changements.");
    return false;
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function fullName(record) {
  return `${record.firstName || ""} ${record.lastName || ""}`.trim();
}

function renderRows(elementId, rows, columns, emptyMessage) {
  const body = document.getElementById(elementId);
  if (!body) return;
  if (rows.length === 0) {
    body.innerHTML = `<tr><td class="empty-row" colspan="${columns}">${escapeHtml(emptyMessage)}</td></tr>`;
    return;
  }
  body.innerHTML = rows.join("");
}

function actionButtons(type, id) {
  return `<div class="table-actions"><button class="table-action" type="button" data-edit="${escapeHtml(type)}" data-id="${escapeHtml(id)}">Modifier</button><button class="table-action delete" type="button" data-delete="${escapeHtml(type)}" data-id="${escapeHtml(id)}">Supprimer</button></div>`;
}

function renderStudents() {
  renderRows("student-rows", store.students.map((student) => `<tr>
    <td><strong>${escapeHtml(fullName(student))}</strong></td>
    <td>${escapeHtml(student.classLevel)}${student.series ? ` / ${escapeHtml(student.series)}` : ""}</td>
    <td>${escapeHtml(student.school)}</td><td>${escapeHtml(student.subjects)}</td>
    <td>${escapeHtml(student.parent)}<br>${escapeHtml(student.phone)}</td><td>${escapeHtml(student.district)}</td>
    <td>${actionButtons("students", student.id)}</td></tr>`), 7, "Aucune fiche élève. Ajoutez-en une pour la démonstration.");
}

function renderTeachers() {
  renderRows("teacher-rows", store.teachers.map((teacher) => `<tr>
    <td><strong>${escapeHtml(fullName(teacher))}</strong></td><td>${escapeHtml(teacher.phone)}</td>
    <td>${escapeHtml(teacher.subjects)}</td><td>${escapeHtml(teacher.classes)}</td><td>${escapeHtml(teacher.availability)}</td>
    <td>${actionButtons("teachers", teacher.id)}</td></tr>`), 6, "Aucune fiche enseignant. Ajoutez-en une pour la démonstration.");
}

function renderAssignments() {
  renderRows("assignment-rows", store.assignments.map((assignment) => {
    const student = store.students.find((item) => item.id === assignment.studentId);
    const teacher = store.teachers.find((item) => item.id === assignment.teacherId);
    return `<tr><td>${escapeHtml(student ? fullName(student) : "Fiche élève supprimée")}</td>
      <td>${escapeHtml(teacher ? fullName(teacher) : "Fiche enseignant supprimée")}</td>
      <td>${escapeHtml(assignment.subject)}</td><td>${escapeHtml(student?.classLevel || "—")}</td>
      <td>${escapeHtml(assignment.availability || "À confirmer")}</td>
      <td><button class="table-action delete" type="button" data-delete="assignments" data-id="${escapeHtml(assignment.id)}">Supprimer</button></td></tr>`;
  }), 6, "Aucune affectation enregistrée.");
}

function renderRequests() {
  renderRows("request-rows", store.requests.map((request) => `<tr>
    <td><strong>${escapeHtml(request.student)}</strong></td><td>${escapeHtml(request.classLevel)}</td>
    <td>${escapeHtml(request.subjects)}</td><td>${escapeHtml(request.parent)}</td>
    <td>${escapeHtml(request.phone)}</td><td>${escapeHtml(request.courseType)}</td><td>${escapeHtml(request.district)}</td></tr>`),
  7, "Aucune demande d’exemple disponible.");
}

function renderClassStats() {
  const container = document.getElementById("class-stats");
  if (!container) return;
  container.innerHTML = CLASS_LEVELS.map((level) => {
    const count = store.students.filter((student) => student.classLevel === level).length;
    return `<div class="class-stat"><span>${escapeHtml(level)}</span><strong>${count}</strong></div>`;
  }).join("");
}

function splitList(value) {
  return String(value || "").split(",").map((item) => item.trim().toLocaleLowerCase("fr")).filter(Boolean);
}

function populateAssignmentOptions() {
  const studentSelect = document.getElementById("assignment-student");
  const subjectSelect = document.getElementById("assignment-subject");
  const teacherSelect = document.getElementById("assignment-teacher");
  if (!studentSelect || !subjectSelect || !teacherSelect) return;
  const previousStudent = studentSelect.value;
  studentSelect.innerHTML = `<option value="">Choisir un élève</option>${store.students.map((student) => `<option value="${escapeHtml(student.id)}">${escapeHtml(fullName(student))} — ${escapeHtml(student.classLevel)}</option>`).join("")}`;
  if (store.students.some((student) => student.id === previousStudent)) studentSelect.value = previousStudent;
  const student = store.students.find((item) => item.id === studentSelect.value);
  const previousSubject = subjectSelect.value;
  const subjects = student ? String(student.subjects || "").split(",").map((item) => item.trim()).filter(Boolean) : [];
  subjectSelect.innerHTML = `<option value="">Choisir une matière</option>${subjects.map((subject) => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`).join("")}`;
  if (subjects.includes(previousSubject)) subjectSelect.value = previousSubject;
  const selectedSubject = subjectSelect.value.toLocaleLowerCase("fr");
  const classLevel = student?.classLevel.toLocaleLowerCase("fr");
  const eligibleTeachers = store.teachers.filter((teacher) =>
    selectedSubject &&
    splitList(teacher.subjects).includes(selectedSubject) &&
    classLevel &&
    splitList(teacher.classes).includes(classLevel) &&
    String(teacher.availability || "").trim()
  );
  const previousTeacher = teacherSelect.value;
  teacherSelect.innerHTML = `<option value="">Choisir un enseignant compatible</option>${eligibleTeachers.map((teacher) => `<option value="${escapeHtml(teacher.id)}">${escapeHtml(fullName(teacher))} — ${escapeHtml(teacher.availability)}</option>`).join("")}`;
  if (eligibleTeachers.some((teacher) => teacher.id === previousTeacher)) teacherSelect.value = previousTeacher;
}

function renderAll() {
  document.querySelector('[data-stat="students"]').textContent = String(store.students.length);
  document.querySelector('[data-stat="teachers"]').textContent = String(store.teachers.length);
  document.querySelector('[data-stat="requests"]').textContent = String(store.requests.length);
  renderClassStats();
  renderStudents();
  renderTeachers();
  renderAssignments();
  renderRequests();
  populateAssignmentOptions();
}

function showPanel(name) {
  const selected = document.querySelector(`[data-panel="${CSS.escape(name)}"]`);
  if (!selected) return;
  document.querySelectorAll(".admin-panel").forEach((panel) => panel.classList.toggle("active", panel === selected));
  document.querySelectorAll("[data-admin-tab]").forEach((link) => link.classList.toggle("active", link.dataset.adminTab === name));
  const title = document.getElementById("admin-page-title");
  const activeLink = document.querySelector(`[data-admin-tab="${CSS.escape(name)}"] span`);
  if (title && activeLink) title.textContent = activeLink.textContent;
}

function openRecordDialog(type, recordId = "") {
  const definition = recordDefinitions[type];
  if (!definition || !(dialog instanceof HTMLDialogElement)) return;
  const record = recordId ? store[type].find((item) => item.id === recordId) : {};
  if (recordId && !record) return;
  activeRecordType = type;
  activeRecordId = recordId;
  document.getElementById("record-dialog-title").textContent = `${recordId ? "Modifier" : "Ajouter"} ${definition.title}`;
  recordError.textContent = "";
  recordFields.innerHTML = definition.fields.map(([key, label, required, options]) => {
    const value = escapeHtml(record?.[key] || "");
    let control = options
      ? `<select name="${key}" ${required ? "required" : ""}><option value="">Choisir</option>${options.map((option) => `<option${option === record?.[key] ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>`
      : `<input name="${key}" value="${value}" maxlength="180" ${required ? "required" : ""}>`;
    return `<label>${escapeHtml(label)}${required ? " *" : ""}${control}</label>`;
  }).join("");
  dialog.showModal();
}

function removeRecord(type, id) {
  const itemName = type === "students" ? "cet élève" : type === "teachers" ? "cet enseignant" : "cette affectation";
  if (!window.confirm(`Supprimer ${itemName} de la démonstration locale ?`)) return;
  if (type === "assignments") {
    store.assignments = store.assignments.filter((item) => item.id !== id);
  } else {
    store[type] = store[type].filter((item) => item.id !== id);
  }
  saveStore();
  renderAll();
}

store = loadStore();
renderAll();

document.querySelectorAll("[data-admin-tab]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPanel(link.dataset.adminTab);
    history.replaceState(null, "", link.getAttribute("href"));
  });
});
if (location.hash) showPanel(decodeURIComponent(location.hash.slice(1)));

document.querySelector('[data-action="new-student"]').addEventListener("click", () => openRecordDialog("students"));
document.querySelector('[data-action="new-teacher"]').addEventListener("click", () => openRecordDialog("teachers"));
document.querySelector('[data-action="reset-demo"]').addEventListener("click", () => {
  if (!window.confirm("Réinitialiser les élèves, enseignants et affectations de démonstration dans ce navigateur ?")) return;
  store = cloneDemoData();
  saveStore();
  renderAll();
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const editButton = target.closest("[data-edit]");
  if (editButton instanceof HTMLElement) {
    openRecordDialog(editButton.dataset.edit, editButton.dataset.id);
    return;
  }
  const deleteButton = target.closest("[data-delete]");
  if (deleteButton instanceof HTMLElement) removeRecord(deleteButton.dataset.delete, deleteButton.dataset.id);
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
document.querySelector('[data-action="cancel-dialog"]').addEventListener("click", () => dialog.close());
recordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  recordError.textContent = "";
  if (!recordForm.reportValidity()) return;
  const values = Object.fromEntries(new FormData(recordForm).entries());
  const definition = recordDefinitions[activeRecordType];
  const record = {
    ...values,
    id: activeRecordId || `${activeRecordType === "students" ? "s" : "t"}-${Date.now()}`
  };
  if (activeRecordId) {
    store[activeRecordType] = store[activeRecordType].map((item) => item.id === activeRecordId ? record : item);
  } else {
    store[activeRecordType].push(record);
  }
  if (saveStore()) {
    dialog.close();
    renderAll();
  } else {
    recordError.textContent = `La fiche ${definition.title} n’a pas pu être enregistrée dans le stockage local.`;
  }
});

const studentSelect = document.getElementById("assignment-student");
const subjectSelect = document.getElementById("assignment-subject");
studentSelect.addEventListener("change", populateAssignmentOptions);
subjectSelect.addEventListener("change", populateAssignmentOptions);
document.getElementById("assignment-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const error = document.getElementById("assignment-error");
  error.textContent = "";
  if (!form.reportValidity()) return;
  const values = Object.fromEntries(new FormData(form).entries());
  const student = store.students.find((item) => item.id === values.student);
  const teacher = store.teachers.find((item) => item.id === values.teacher);
  const compatible = student && teacher &&
    splitList(teacher.subjects).includes(values.subject.toLocaleLowerCase("fr")) &&
    splitList(teacher.classes).includes(student.classLevel.toLocaleLowerCase("fr")) &&
    String(teacher.availability || "").trim();
  if (!compatible) {
    error.textContent = "Aucun enseignant compatible n’est sélectionné. Vérifiez la matière, la classe et les disponibilités.";
    populateAssignmentOptions();
    return;
  }
  store.assignments.push({
    id: `a-${Date.now()}`,
    studentId: student.id,
    teacherId: teacher.id,
    subject: values.subject,
    availability: values.availability.trim() || teacher.availability
  });
  if (saveStore()) {
    form.reset();
    renderAll();
  } else {
    error.textContent = "L’affectation n’a pas pu être enregistrée dans le stockage local.";
  }
});

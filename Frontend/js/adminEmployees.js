// Everything that happens on the Employees page of the admin

const employeeTableBody = document.getElementById("employeeTableBody");
const runPayrollList = document.getElementById("runPayrollList");
const totalPayrollAmount = document.getElementById("totalPayrollAmount");
const dashboardTotalPay = document.getElementById("dashboardTotalPay");
const addEmployeeForm = document.querySelector("#addEmployeeForm");

let nextLocalEmployeeId = 1;
let currentEmployees = employees.map(createSampleEmployeeRecord);

// ---Adding an employee---
document.querySelector("#employees .btn-primary").addEventListener("click", () => {
    showPage("addEmployee");
    renderBenefitsCheckboxes();
});

addEmployeeForm.addEventListener("submit", async event => {
    event.preventDefault();

    const newEmployee = createFormEmployeeRecord();
    currentEmployees.push(newEmployee);
    renderEmployeeViews();
    addEmployeeForm.reset();

    try {
        const response = await fetch(`${API}/employees`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullName: newEmployee.name,
                email: newEmployee.email,
                hourlyRate: newEmployee.hourlyRate,
                jobTitle: newEmployee.role === "—" ? null : newEmployee.role,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to save employee: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to save employee:", error);
    }
});

// ─── Benefits Checkboxes (employee form) ────────────────────────────────────
function renderBenefitsCheckboxes() {
    const container = document.getElementById("benefitsCheckboxes");
    container.innerHTML = "";
    benefits.forEach(benefit => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" name="benefits" value="${benefit.name}">${benefit.name}`;
        container.appendChild(label);
    });
}

// Cancel on "Add Employee" goes back to employees list
document.querySelector("#addEmployee .btn-tertiary").addEventListener("click", () => {
    showPage("employees");
    loadEmployees();
});

// Cancel on Edit Employee goes back to employees list
document.querySelector("#editEmployee .btn-tertiary").addEventListener("click", () => {
    showPage("employees");
    loadEmployees();
});

function createSampleEmployeeRecord(employee) {
    return {
        id: `sample-${nextLocalEmployeeId++}`,
        name: employee.name,
        payAmount: parsePayAmount(employee.pay),
        payLabel: employee.pay.startsWith("$") ? employee.pay : `$${employee.pay}`,
        role: employee.role || "—",
        hours: employee.hours || "—",
        payDate: employee.payDate || "—",
    };
}

function createApiEmployeeRecord(employee) {
    const hourlyRate = Number(employee.hourlyRate || 0);

    return {
        id: employee.id ?? `api-${nextLocalEmployeeId++}`,
        name: employee.fullName || "—",
        payAmount: hourlyRate,
        payLabel: `$${formatNumber(hourlyRate)}/hr`,
        role: employee.jobTitle || "—",
        hours: "—",
        payDate: "—",
    };
}

function createFormEmployeeRecord() {
    const fullName = `${document.getElementById("firstNameInput").value} ${document.getElementById("LastNameInput").value}`.trim() || "—";
    const salary = Number(document.getElementById("salaryInput").value);
    const payAmount = Number.isFinite(salary) ? Math.floor(salary / 26) : 0;
    const role = document.getElementById("roleInput").value.trim() || "—";

    return {
        id: `local-${nextLocalEmployeeId++}`,
        name: fullName,
        payAmount,
        payLabel: `$${formatNumber(payAmount, 0, 2)}`,
        role,
        hours: "—",
        payDate: "—",
        email: document.getElementById("emailInput").value.trim(),
        hourlyRate: document.getElementById("salaryInput").value,
    };
}

function parsePayAmount(value) {
    const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value, minimumFractionDigits = 2, maximumFractionDigits = 2) {
    return Number(value).toLocaleString("en-US", {
        minimumFractionDigits,
        maximumFractionDigits,
    });
}

function getEmployeeActionsMarkup() {
    return `<td class="employee-actions-cell"><div class="employee-row-actions"><button class="button edit-btn">
    Edit</button><button class="remove-employee-btn">Remove</button></div>
    </td>`;
}

function renderEmployeeTable() {
    employeeTableBody.innerHTML = "";

    if (!currentEmployees.length) {
        employeeTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No employees found</td></tr>`;
        return;
    }

    currentEmployees.forEach(employee => {
        const row = document.createElement("tr");
        row.dataset.employeeId = String(employee.id);
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.payLabel}</td>
            <td>${employee.role}</td>
            <td>${employee.hours}</td>
            <td>${employee.payDate}</td>
            ${getEmployeeActionsMarkup()}
        `;
        employeeTableBody.appendChild(row);
    });
}

function renderRunPayrollList() {
    runPayrollList.innerHTML = "";

    if (!currentEmployees.length) {
        runPayrollList.innerHTML = `<tr><td colspan="3" style="text-align:center;">No employees found</td></tr>`;
        updateTotalPayDisplays();
        return;
    }

    currentEmployees.forEach(employee => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.payLabel}</td>
            <td>${employee.hours}</td>
        `;
        runPayrollList.appendChild(row);
    });

    updateTotalPayDisplays();
}

function updateEmployeeCount() {
    document.querySelector("#employeeCount .card-info").textContent = String(currentEmployees.length);
}

function updateTotalPayDisplays() {
    const totalPay = currentEmployees.reduce((sum, employee) => sum + employee.payAmount, 0);
    const formattedTotal = `$${formatNumber(totalPay)}`;

    totalPayrollAmount.textContent = formattedTotal;
    dashboardTotalPay.textContent = formattedTotal;
}

function renderEmployeeViews() {
    renderEmployeeTable();
    renderRunPayrollList();
    updateEmployeeCount();
}

// ─── API: Load Employees ────────────────────────────────────────────────────
async function loadEmployees() {
    try {
        const response = await fetch(`${API}/employees`);

        if (!response.ok) {
            throw new Error(`Failed to load employees: ${response.status}`);
        }

        const apiEmployees = await response.json();
        currentEmployees = apiEmployees.map(createApiEmployeeRecord);
    } catch (err) {
        console.error("Failed to load employees:", err);
    }

    renderEmployeeViews();
}

// Edit/Remove employee buttons
employeeTableBody.addEventListener("click", event => {
    const editButton = event.target.closest(".edit-btn");
    const removeButton = event.target.closest(".remove-employee-btn");

    if (editButton) {
        renderBenefitsCheckboxes();
        showPage("editEmployee");
        return;
    }

    if (removeButton) {
        const row = removeButton.closest("tr");
        const employeeId = row?.dataset.employeeId;

        currentEmployees = currentEmployees.filter(employee => String(employee.id) !== employeeId);
        renderEmployeeViews();
    }
});

renderEmployeeViews();

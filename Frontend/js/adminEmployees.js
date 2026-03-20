// Everything that happens on the Employees page of the admin

// ---Adding an employee---
document.querySelector("#employees .btn-primary").addEventListener("click", () => {
    showPage("addEmployee");
    renderBenefitsCheckboxes();
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

// ─── API: Load Employees ────────────────────────────────────────────────────
async function loadEmployees() {
    try {
        const res = await fetch(`${API}/employees`);
        const employees = await res.json();
        const tbody = document.getElementById("employeeTableBody");
        tbody.innerHTML = "";

        if (employees.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No employees found</td></tr>`;
            return;
        }

        employees.forEach(emp => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${emp.fullName}</td>
                <td>$${Number(emp.hourlyRate).toFixed(2)}/hr</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Failed to load employees:", err);
    }
}

// Add Employee---------------------------------------------------------- 

// after add employee submission
function addRow(employee) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${employee.name}</td><td>${employee.pay}</td><td>${employee.role}</td>
    <td>${employee.hours}</td><td>${employee.payDate}</td><td><button id="editEmployeeBtn" class="button edit-btn">
    Edit</button>
    </td>`;
    document.getElementById("employeeTableBody").appendChild(row);
};

// Populate table with sample data
//employees.forEach(addRow);

document.getElementById("addEmployeeForm").addEventListener('submit', function(e) {
    e.preventDefault();
    const newEmployee = {
        name: document.getElementById("firstNameInput").value + " " +
              document.getElementById("LastNameInput").value,

        // pay = salary/26 payments(bi-weekly)
        pay: Math.floor(document.getElementById("salaryInput").value / 26),
        role: document.getElementById("roleInput").value,
    };

    employees.push(newEmployee);
    addRow(newEmployee);
    this.reset();
});

// Edit Employee button
document.getElementById("employeeTableBody").addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
        renderBenefitsCheckboxes();
        showPage("editEmployee");
    }
});

// Edit Employee page
const editButton = document.querySelector("#editEmployee");

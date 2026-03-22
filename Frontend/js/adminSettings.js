// Everything that happens on the Settings page of the admin

// ─── Settings: Benefits Panel ───────────────────────────────────────────────
function renderSettingsBenefits() {
    const list = document.getElementById("benefitsList");
    list.innerHTML = "";
    benefits.forEach((benefit, index) => {
        const li = document.createElement("li");
        li.className = "list-item";
        li.innerHTML = `<span>${benefit.name}</span><button class="remove"><img src="icons/close_light.svg" alt="remove"></button>`;
        li.addEventListener("click", () => {
            list.querySelectorAll(".list-item").forEach(i => i.classList.remove("selected"));
            li.classList.add("selected");
            document.getElementById("benefitNameInput").value = benefit.name;
            document.getElementById("benefitPercentageInput").value = benefit.percentage;
        });
        li.querySelector(".remove").addEventListener("click", (e) => {
            e.stopPropagation();
            benefits.splice(index, 1);
            renderSettingsBenefits();
        });
        list.appendChild(li);
    });
}


// ─── Settings: State Tax Panel ───────────────────────────────────────────────
function renderStateTaxes() {
    const list = document.getElementById("stateTaxList");
    list.innerHTML = "";
    stateTaxes.forEach((tax, index) => {
        const li = document.createElement("li");
        li.className = "list-item";
        li.innerHTML = `<span>${tax}%</span><button class="remove"><img src="icons/close_light.svg" alt="remove"></button>`;
        li.addEventListener("click", () => {
            list.querySelectorAll(".list-item").forEach(i => i.classList.remove("selected"));
            li.classList.add("selected");
            document.getElementById("stateTaxPercentageInput").value = tax;
        });
        li.querySelector(".remove").addEventListener("click", (e) => {
            e.stopPropagation();
            stateTaxes.splice(index, 1);
            renderStateTaxes();
        });
        list.appendChild(li);
    });
}

// ─── Settings: Federal Tax Panel ─────────────────────────────────────────────
function renderFederalTaxes() {
    const list = document.getElementById("federalTaxList");
    list.innerHTML = "";
    federalTaxes.forEach((tax, index) => {
        const li = document.createElement("li");
        li.className = "list-item";
        li.innerHTML = `<span>${tax}%</span><button class="remove"><img src="icons/close_light.svg" alt="remove"></button>`;
        li.addEventListener("click", () => {
            list.querySelectorAll(".list-item").forEach(i => i.classList.remove("selected"));
            li.classList.add("selected");
            document.getElementById("federalTaxPercentageInput").value = tax;
        });
        li.querySelector(".remove").addEventListener("click", (e) => {
            e.stopPropagation();
            federalTaxes.splice(index, 1);
            renderFederalTaxes();
        });
        list.appendChild(li);
    });
}

// ─── Number-only enforcement for percentage inputs ───────────────────────────
document.querySelectorAll("#benefitPercentageInput, #stateTaxPercentageInput, #federalTaxPercentageInput").forEach(input => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
    });
});

// Populate settings on load
renderSettingsBenefits();
renderStateTaxes();
renderFederalTaxes();

// ─── Settings: Add Benefit ───────────────────────────────────────────────────
document.getElementById("addBenefitBtn").addEventListener("click", () => {
    const name = document.getElementById("benefitNameInput").value.trim();
    const percentage = parseFloat(document.getElementById("benefitPercentageInput").value);
    if (!name || isNaN(percentage)) return;
    benefits.push({ name, percentage });
    renderSettingsBenefits();
    document.getElementById("benefitNameInput").value = "";
    document.getElementById("benefitPercentageInput").value = "";
});

// ─── Settings: Add State Tax ─────────────────────────────────────────────────
document.getElementById("addStateTaxBtn").addEventListener("click", () => {
    const percentage = parseFloat(document.getElementById("stateTaxPercentageInput").value);
    if (isNaN(percentage)) return;
    stateTaxes.push(percentage);
    renderStateTaxes();
    document.getElementById("stateTaxPercentageInput").value = "";
});

// ─── Settings: Add Federal Tax ───────────────────────────────────────────────
document.getElementById("addFederalTaxBtn").addEventListener("click", () => {
    const percentage = parseFloat(document.getElementById("federalTaxPercentageInput").value);
    if (isNaN(percentage)) return;
    federalTaxes.push(percentage);
    renderFederalTaxes();
    document.getElementById("federalTaxPercentageInput").value = "";
});
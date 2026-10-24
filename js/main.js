(function () {
  var header = document.querySelector(".header");
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");
  var year = document.querySelector("#year");
  var form = document.querySelector("#request-form");
  var success = document.querySelector("#form-success");
  var phoneLink = "77000000000";

  if (year) year.textContent = String(new Date().getFullYear());

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 8);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeNav() {
    if (!nav || !burger) return;
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-lock");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-lock", open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  document.querySelectorAll("[data-district]").forEach(function (link) {
    link.addEventListener("click", function () {
      var district = document.querySelector("#district");
      if (district) district.value = link.getAttribute("data-district") || "";
    });
  });

  document.querySelectorAll("[data-symptom]").forEach(function (button) {
    button.addEventListener("click", function () {
      var problem = document.querySelector("#problem");
      var appliance = document.querySelector("#appliance");
      if (problem) problem.value = button.getAttribute("data-symptom") || "";
      if (appliance && button.getAttribute("data-type")) {
        appliance.value = button.getAttribute("data-type");
      }
      var contact = document.querySelector("#contact");
      if (contact) contact.scrollIntoView({ behavior: "smooth" });
      var name = document.querySelector("#name");
      if (name) window.setTimeout(function () { name.focus(); }, 400);
    });
  });

  function clearErrors() {
    form.querySelectorAll(".field").forEach(function (field) {
      field.classList.remove("has-error");
    });
  }

  function setError(id) {
    var input = document.querySelector("#" + id);
    if (input && input.closest(".field")) input.closest(".field").classList.add("has-error");
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors();

      var honeypot = form.querySelector(".hp");
      if (honeypot && honeypot.value) return;

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var digits = phone.replace(/\D/g, "");
      if (digits.length === 11 && digits.charAt(0) === "8") digits = "7" + digits.slice(1);
      if (digits.length === 10) digits = "7" + digits;
      var appliance = form.appliance.value;
      var district = form.district.value;
      var problem = form.problem.value.trim();
      var valid = true;

      if (name.length < 2) {
        setError("name");
        valid = false;
      }
      if (digits.length < 11) {
        setError("phone");
        valid = false;
      }
      if (!appliance) {
        setError("appliance");
        valid = false;
      }
      if (!valid) return;

      var lines = [
        "Здравствуйте! Заявка с сайта ФростПро.",
        "Имя: " + name,
        "Телефон: " + phone,
        "Техника: " + appliance,
        "Район: " + (district || "не указан"),
        "Что случилось: " + (problem || "не описано")
      ];
      var url = "https://wa.me/" + phoneLink + "?text=" + encodeURIComponent(lines.join("\n"));

      form.hidden = true;
      if (success) {
        success.hidden = false;
        var openLink = success.querySelector("a");
        if (openLink) openLink.href = url;
      }

      window.open(url, "_blank", "noopener");
    });
  }
})();

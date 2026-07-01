const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitBtn = form?.querySelector(".contact-form__submit");
const submitText = form?.querySelector(".contact-form__submit-text");
const submitLoading = form?.querySelector(".contact-form__submit-loading");

const FORM_ENDPOINT = "https://formsubmit.co/ajax/he1is1mohamed@gmail.com";

function showStatus(message, type) {
  status.textContent = message;
  status.className = `contact-form__status${type ? ` contact-form__status--${type}` : ""}`;
}

if (window.location.protocol === "file:") {
  showStatus(
    "This form must be opened through a web server (not as a local file). Deploy the site or run a local server to send messages.",
    "error"
  );
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (window.location.protocol === "file:") {
      showStatus(
        "Cannot send from a local file. Open this site through a web server or deploy it online.",
        "error"
      );
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitText.hidden = true;
    submitLoading.hidden = false;
    showStatus("");

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      const data = await response.json().catch(() => null);

      if (data?.success === "true" || data?.success === true) {
        form.reset();
        showStatus("Message sent successfully. I'll get back to you soon.", "success");
        return;
      }

      const message = data?.message || "Failed to send your message.";

      if (/activation/i.test(message)) {
        showStatus(
          "Almost there — check he1is1mohamed@gmail.com (and spam) for a FormSubmit activation email and click the link. Then try again.",
          "error"
        );
        return;
      }

      if (/web server/i.test(message)) {
        showStatus(
          "This form only works when the site is served through a web server, not opened as a local file.",
          "error"
        );
        return;
      }

      throw new Error(message);
    } catch (error) {
      showStatus(
        error.message === "Failed to fetch"
          ? "Network error. Check your connection and try again."
          : `Something went wrong. ${error.message || "Please email he1is1mohamed@gmail.com directly."}`,
        "error"
      );
    } finally {
      submitBtn.disabled = false;
      submitText.hidden = false;
      submitLoading.hidden = true;
    }
  });
}

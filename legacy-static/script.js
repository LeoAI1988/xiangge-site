(function () {
  const STORAGE_KEY = "xiangge_ai_workflow_claims";
  const leadForm = document.querySelector("#leadForm");
  const formError = document.querySelector("#formError");
  const formSuccess = document.querySelector("#formSuccess");
  const header = document.querySelector("[data-header]");
  const resourceCards = Array.from(document.querySelectorAll("[data-resource-card]"));
  const resourceActions = Array.from(document.querySelectorAll("[data-resource-action]"));
  const adminPanel = document.querySelector("[data-admin-panel]");
  const exportButton = document.querySelector("[data-export-leads]");
  const clearButton = document.querySelector("[data-clear-leads]");
  const unlockedMessage = document.querySelector("[data-unlocked-message]");

  function readClaims() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeClaims(claims) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
  }

  function normalize(value) {
    return String(value || "").trim();
  }

  function isValidPhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone.replace(/\s+/g, ""));
  }

  function isValidWechat(wechat) {
    const value = normalize(wechat);
    return value.length >= 2 && value.length <= 40 && !/\s/.test(value);
  }

  function setMessage(type, message) {
    formError.textContent = type === "error" ? message : "";
    formSuccess.textContent = type === "success" ? message : "";
  }

  function setResourceReady(isReady) {
    resourceCards.forEach((card) => card.classList.toggle("is-ready", isReady));
    resourceActions.forEach((button) => {
      button.textContent = isReady ? "已登记，等待发放" : button.dataset.defaultText || button.textContent;
      button.disabled = isReady;
    });
    if (unlockedMessage) {
      unlockedMessage.hidden = !isReady;
    }
  }

  async function sendClaimToEndpoint(payload) {
    if (!location.protocol.startsWith("http")) {
      return { ok: false, reason: "static-file" };
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return { ok: response.ok, status: response.status };
    } catch (error) {
      return { ok: false, reason: "endpoint-missing" };
    }
  }

  function toCsvValue(value) {
    const text = String(value == null ? "" : value);
    return `"${text.replace(/"/g, '""')}"`;
  }

  function exportClaims() {
    const claims = readClaims();
    const headers = ["createdAt", "name", "phone", "wechat", "scenario", "source"];
    const rows = claims.map((claim) => headers.map((key) => toCsvValue(claim[key])).join(","));
    const csv = "\ufeff" + headers.join(",") + "\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `xiangge-ai-claims-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  resourceActions.forEach((button) => {
    button.dataset.defaultText = button.textContent;
    button.addEventListener("click", () => {
      document.querySelector("#claim").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  });

  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(leadForm);
    const payload = {
      createdAt: new Date().toISOString(),
      name: normalize(formData.get("name")),
      phone: normalize(formData.get("phone")).replace(/\s+/g, ""),
      wechat: normalize(formData.get("wechat")),
      scenario: normalize(formData.get("scenario")),
      source: "xiangge-ai-workflow-landing-page",
    };
    const consent = formData.get("consent") === "on";

    if (!payload.phone) {
      setMessage("error", "请填写手机号，用于后续匹配课程购买身份。");
      return;
    }

    if (!isValidPhone(payload.phone)) {
      setMessage("error", "手机号格式不正确，请填写 11 位中国大陆手机号。");
      return;
    }

    if (!payload.wechat) {
      setMessage("error", "请填写微信号，用于发放资料、网盘码和 Skill 下载通知。");
      return;
    }

    if (!isValidWechat(payload.wechat)) {
      setMessage("error", "微信号格式不正确，请确认后再提交。");
      return;
    }

    if (!consent) {
      setMessage("error", "请先勾选同意用于赠品领取和课程通知。");
      return;
    }

    const claims = readClaims();
    claims.unshift(payload);
    writeClaims(claims.slice(0, 500));
    await sendClaimToEndpoint(payload);

    leadForm.reset();
    setResourceReady(true);
    setMessage("success", "已登记。正式上线后将按手机号和微信号发放课程赠品、PDF 与 Skill 下载权限。");
  });

  if (new URLSearchParams(location.search).get("admin") === "1") {
    adminPanel.hidden = false;
  }

  exportButton.addEventListener("click", exportClaims);
  clearButton.addEventListener("click", () => {
    writeClaims([]);
    setResourceReady(false);
  });

  setResourceReady(readClaims().length > 0);
})();

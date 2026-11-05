async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand('copy');
    area.remove();
    return copied;
  }
}

document.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-copy]');
  if (!button) return;

  const target = document.querySelector(button.dataset.copy);
  if (!target) return;

  const copied = await copyText(target.textContent.trim());
  const original = button.textContent;

  button.textContent = copied ? 'Скопійовано' : 'Не вдалося';
  button.classList.toggle('copied', copied);

  setTimeout(() => {
    button.textContent = original;
    button.classList.remove('copied');
  }, 1800);
});

const tipsForm = document.getElementById('tips-form') as HTMLFormElement;
const formBlock = document.getElementById('form-block') as HTMLDivElement;

async function submitTip(data: Record<string, string>) {
  try {
    const response = await fetch('/api/tips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

tipsForm.addEventListener('submit', async (event: SubmitEvent) => {
  event.preventDefault();

  const formData = new FormData(tipsForm);
  const payload: Record<string, string> = {};

  formData.forEach((value, key) => {
    payload[key] = value.toString();
  });

  try {
    await submitTip(payload);

    formBlock.innerHTML = `<div class="form-response success">
  <svg width="100" height="100" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="green" />
    <path d="M30 50 L45 65 L70 35" stroke="white" stroke-width="10" fill="none" />
  </svg>
  <p>Tack för ditt tips! Vi har mottagit din inlämning.</p>
</div>`;
  } catch {
    formBlock.innerHTML = `<div class="form-response error">
  <svg width="100" height="100" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="red" />
    <line x1="30" y1="30" x2="70" y2="70" stroke="white" stroke-width="10" />
    <line x1="70" y1="30" x2="30" y2="70" stroke="white" stroke-width="10" />
  </svg>
  <p>Det gick inte att skicka tipset. Försök igen senare.</p>
</div>`;
  }

  console.log('Form submitted with data:', payload);
});





import { insertIntoTable } from "../supabase.ts";

const tipsForm = document.getElementById('tips-form') as HTMLFormElement;
const formBlock = document.getElementById('form-block') as HTMLDivElement;

type Suggestion = {
  name: string;
  description: string;
  email: string;
  status?: string;
};

async function submitTip(data: Suggestion) {
  try {
    return await insertIntoTable('suggestion', data);
  } catch (error) {
    console.error('Error, could not submit tip:', error);
    throw error;
  }
}

//Submit event listener
tipsForm.addEventListener('submit', async (event: SubmitEvent) => {
  event.preventDefault();

  const formData = new FormData(tipsForm);
  const payload: Suggestion = {
  name: formData.get("name")?.toString() || "",
  description: formData.get("description")?.toString() || "",
  email: formData.get("email")?.toString() || "",
  status: "pending",
};

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
});





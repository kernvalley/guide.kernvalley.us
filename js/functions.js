export async function installPrompt() {
	const HTMLInstallPromptElement = await customElements.whenDefined('install-prompt');
	return await new HTMLInstallPromptElement().show();
}

export function getMeta(name, { base = document.head } = {}) {
	const meta = base.querySelector(`meta[name="${name}"], meta[itemprop~="${name}"], meta[property="${name}"]`);

	return meta instanceof HTMLMetaElement ? meta.content : null;
}

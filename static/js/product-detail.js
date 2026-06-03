document.addEventListener('DOMContentLoaded', function() {
    const variantsScript = document.getElementById('variants-data');
    let variants = [];
    try {
        variants = variantsScript ? JSON.parse(variantsScript.textContent) : [];
    } catch (e) {
        console.error('Failed to parse variants JSON', e);
        variants = [];
    }

    const colorSelect = document.getElementById('color-select');
    const storageSelect = document.getElementById('storage-select');
    const variantInput = document.getElementById('variant-id-input');

    if (!colorSelect || !storageSelect || !variantInput) return;

    let colors = [...new Set(variants.map(v => v.color))];
    const nonDefaultColors = colors.filter(c => c !== 'Default');
    if (nonDefaultColors.length > 0) {
        colors = nonDefaultColors;
    }
    colorSelect.innerHTML = '';
    colors.forEach((c) => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        colorSelect.appendChild(opt);
    });

    function formatStorageLabel(storage) {
        return storage === '1TB' ? '1T' : storage;
    }

    function populateStoragesForColor(color) {
        storageSelect.innerHTML = '';
        const storages = [...new Set(variants.filter(v => v.color === color).map(v => v.storage))];
        storages.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = formatStorageLabel(s);
            storageSelect.appendChild(opt);
        });
    }

    function selectPreferredStorage() {
        const preferred = '1TB';
        const option = Array.from(storageSelect.options).find(opt => opt.value === preferred);
        if (option) {
            storageSelect.value = preferred;
            return;
        }
        if (storageSelect.options.length > 0) {
            storageSelect.selectedIndex = 0;
        }
    }

    function updateVariantInput() {
        const color = colorSelect.value;
        const storage = storageSelect.value;
        const found = variants.find(v => v.color === color && v.storage === storage);
        variantInput.value = found ? found.id : '';
    }

    colorSelect.addEventListener('change', () => {
        populateStoragesForColor(colorSelect.value);
        selectPreferredStorage();
        updateVariantInput();
    });
    storageSelect.addEventListener('change', updateVariantInput);

    if (colors.length > 0) {
        colorSelect.value = colors[0];
        populateStoragesForColor(colors[0]);
        selectPreferredStorage();
        updateVariantInput();
    }
});

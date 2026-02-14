/**
 * Tier 3: Logic & Config
 */
const siteConfig = {
    meta: {
        framework: 'V4',
        type: 'form',
        mode: 'demo',
        lang: 'ko',
        theme: true
    },
    api: {
        server: 'damso',
        turnstile: '0x4AAAAAABrG4DQP8tkp1_TI',
        redirect: '../'
    },
    allowed_extensions: ['jpg', 'png', 'webp', 'zip', 'pdf', 'xlsx']
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.V4) {
        window.V4.init(siteConfig);
    }

    initDateConstraints();
    initBirthYearOptions();
    initDynamicVisitors();
});

// Helper to generate year options
function getYearOptions() {
    const currentYear = new Date().getFullYear();
    let options = '';
    for (let y = currentYear - 18; y >= currentYear - 60; y--) {
        options += `<option value="${y}">${y}</option>`;
    }
    return options;
}

function initBirthYearOptions() {
    const selects = document.querySelectorAll('.js-birth-year');
    const options = getYearOptions();
    selects.forEach(sel => {
        // Prevent duplicate options if called multiple times or pre-filled
        if (sel.options.length <= 1) {
            sel.innerHTML = options;
        }
    });
}

function initDateConstraints() {
    const dateInput = document.getElementById('reservation_date');
    if (!dateInput) return;

    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const maxDate = new Date(today); maxDate.setMonth(today.getMonth() + 3);

    dateInput.min = tomorrow.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];

    const wrapper = dateInput.closest('.date-time-wrapper');
    if (wrapper) {
        wrapper.addEventListener('click', () => {
            try { dateInput.showPicker(); } catch (e) { dateInput.focus(); }
        });
    }
}

function initDynamicVisitors() {
    const radios = document.querySelectorAll('input[name="visitor_count"]');
    const container = document.getElementById('visitor-details-container');
    const yearOptions = getYearOptions(); // Re-use helper

    const texts = {
        ko: { item: "방문자", name: "성명", gender: "성별", male: "남", female: "여", birth: "출생년도" },
        en: { item: "Visitor", name: "Name", gender: "Gender", male: "Male", female: "Female", birth: "Birth Year" }
    };
    const lang = (new URLSearchParams(window.location.search).get('lang') === 'en') ? 'en' : 'ko';
    const t = texts[lang];

    const update = () => {
        const checked = document.querySelector('input[name="visitor_count"]:checked');
        if (!checked) return;

        const count = parseInt(checked.value);
        container.innerHTML = '';

        if (count > 1) {
            for (let i = 2; i <= count; i++) {
                const html = `
                <div class="site-dynamic-item">
                    <span class="site-dynamic-title">${t.item} ${i}</span>
                    
                    <div class="pv-group">
                        <label class="pv-label">${t.name}</label>
                        <input class="pv-input" name="visitors[${i - 1}][name]" type="text" required>
                    </div>

                    <div class="site-row-datetime">
                        <div class="pv-group">
                            <label class="pv-label">${t.gender}</label>
                            <div class="site-segmented-control">
                                <input type="radio" id="v_gen_m_${i}" name="visitors[${i - 1}][gender]" value="M" checked>
                                <label for="v_gen_m_${i}">${t.male}</label>
                                
                                <input type="radio" id="v_gen_f_${i}" name="visitors[${i - 1}][gender]" value="F">
                                <label for="v_gen_f_${i}">${t.female}</label>
                            </div>
                        </div>

                        <div class="pv-group">
                            <label class="pv-label">${t.birth}</label>
                            <select class="pv-select" name="visitors[${i - 1}][birth_year]">
                                ${yearOptions}
                            </select>
                        </div>
                    </div>
                </div>`;
                container.insertAdjacentHTML('beforeend', html);
            }
        }
    };

    radios.forEach(r => r.addEventListener('change', update));
    update();
}
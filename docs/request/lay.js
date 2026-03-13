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
    const yearOptions = getYearOptions();

    const update = () => {
        const checked = document.querySelector('input[name="visitor_count"]:checked');
        if (!checked) return;

        const count = parseInt(checked.value);
        container.innerHTML = '';

        if (count > 1) {
            // Use V4 Data for translations
            const t = {
                item: window.V4.Data.get('visitor_label') || 'Visitor',
                name: window.V4.Data.get('applicant_name') || 'Name',
                gender: window.V4.Data.get('applicant_gender') || 'Gender',
                male: window.V4.Data.get('label_male') || 'Male',
                female: window.V4.Data.get('label_female') || 'Female',
                birth: window.V4.Data.get('applicant_birth') || 'Birth Year'
            };

            for (let i = 2; i <= count; i++) {
                const html = `
                <div class="site-dynamic-item">
                    <span class="site-dynamic-title">${t.item} ${i}</span>
                    
                    <div class="damso-group">
                        <label class="damso-label">${t.name}</label>
                        <input class="damso-input" name="visitors[${i - 1}][name]" type="text" required>
                    </div>

                    <div class="site-row-datetime">
                        <div class="damso-group">
                            <label class="damso-label">${t.gender}</label>
                            <div class="site-segmented-control">
                                <input type="radio" id="v_gen_m_${i}" name="visitors[${i - 1}][gender]" value="M" checked>
                                <label for="v_gen_m_${i}">${t.male}</label>
                                
                                <input type="radio" id="v_gen_f_${i}" name="visitors[${i - 1}][gender]" value="F">
                                <label for="v_gen_f_${i}">${t.female}</label>
                            </div>
                        </div>

                        <div class="damso-group">
                            <label class="damso-label">${t.birth}</label>
                            <select class="damso-select" name="visitors[${i - 1}][birth_year]">
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
    // V4 initialization is async, so we wait for Data to be ready if needed, 
    // but typically DOMContentLoaded + V4.init.then is safer.
    // For now, we rely on the radios change event and initial call.
    if (window.V4 && window.V4.Data) {
        update();
    }
}
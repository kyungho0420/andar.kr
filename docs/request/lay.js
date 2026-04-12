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
        server: 'provider',
        redirect: '../'
    },
    allowed_extensions: ['jpg', 'png', 'webp', 'zip', 'pdf', 'xlsx']
};

document.addEventListener('DOMContentLoaded', () => {
    // V4 init은 form.js가 처리하므로 먼저 호출
    if (window.V4) {
        window.V4.init(siteConfig);
    }

    // 동적 필드는 V4와 독립적으로 이벤트 위임 방식으로 처리
    initDateConstraints();
    initBirthYearOptions();
    initDynamicVisitors();
});

// Helper: year options HTML 생성
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

// 번역 텍스트: V4 Core가 준비된 경우 사용, 아니면 폴백
function gt(key, fallback) {
    try {
        const text = window.V4 && window.V4.Core && window.V4.Core.Util
            ? window.V4.Core.Util.getText(key)
            : null;
        return (text && text !== key) ? text : fallback;
    } catch (e) {
        return fallback;
    }
}

function renderVisitorFields(count) {
    const container = document.getElementById('visitor-details-container');
    if (!container) return;

    container.innerHTML = '';
    if (count <= 1) return;

    const yearOptions = getYearOptions();

    for (let i = 2; i <= count; i++) {
        container.insertAdjacentHTML('beforeend', `
        <div class="site-dynamic-item">
            <span class="site-dynamic-title">${gt('visitor_label', '방문자')} ${i}</span>
            <div class="damso-group">
                <label class="damso-label">${gt('applicant_name', '성명')}</label>
                <input class="damso-input" name="visitors[${i-1}][name]" type="text" required>
            </div>
            <div class="site-row-datetime">
                <div class="damso-group">
                    <label class="damso-label">${gt('applicant_gender', '성별')}</label>
                    <div class="site-segmented-control">
                        <input type="radio" id="v_gen_m_${i}" name="visitors[${i-1}][gender]" value="M" checked>
                        <label for="v_gen_m_${i}">${gt('label_male', '남')}</label>
                        <input type="radio" id="v_gen_f_${i}" name="visitors[${i-1}][gender]" value="F">
                        <label for="v_gen_f_${i}">${gt('label_female', '여')}</label>
                    </div>
                </div>
                <div class="damso-group">
                    <label class="damso-label">${gt('applicant_birth', '출생년도')}</label>
                    <select class="damso-select" name="visitors[${i-1}][birth_year]">
                        ${yearOptions}
                    </select>
                </div>
            </div>
        </div>`);
    }
}

function initDynamicVisitors() {
    // 이벤트 위임: document에 change 이벤트를 걸어 V4 초기화 타이밍과 무관하게 동작
    document.addEventListener('change', (e) => {
        if (e.target && e.target.name === 'visitor_count') {
            renderVisitorFields(parseInt(e.target.value));
        }
    });
}
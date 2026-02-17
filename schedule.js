const _supabaseSchedule = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const scheduleSection = document.getElementById('ders-programi');
const scheduleBody = document.getElementById('scheduleBody');
const scheduleLink = document.getElementById('scheduleLink');
const scheduleRoleText = document.getElementById('scheduleRoleText');

// Edit Modal
const editScheduleModal = document.getElementById('editScheduleModal');
const scheduleForm = document.getElementById('scheduleForm');
const editSubjectInput = document.getElementById('editSubject');
const editDayInput = document.getElementById('editDay');
const editTimeInput = document.getElementById('editTime');
const closeScheduleBtn = document.querySelector('.close-schedule');

// Initial Load
function initSchedule(role) {
    if (role === 'Veli' || role === 'Öğretmen') {
        scheduleLink.style.display = 'block';
        scheduleSection.style.display = 'block';

        if (role === 'Öğretmen') {
            scheduleRoleText.textContent = 'Öğretmen Paneli: Ders eklemek veya düzenlemek için kutucuklara tıklayın.';
        } else {
            scheduleRoleText.textContent = 'Veli Paneli: Ders programını görüntülemektesiniz.';
        }

        loadScheduleData(role);
    } else {
        hideSchedule();
    }
}

function hideSchedule() {
    scheduleLink.style.display = 'none';
    scheduleSection.style.display = 'none';
}

async function loadScheduleData(role) {
    // 1. Fetch data
    const { data: scheduleData, error } = await _supabaseSchedule
        .from('schedule')
        .select('*');

    if (error) {
        console.error('Error loading schedule:', error);
        return;
    }

    // 2. Render Table
    renderTable(scheduleData, role);
}

function renderTable(data, role) {
    scheduleBody.innerHTML = '';

    TIME_SLOTS.forEach(time => {
        const row = document.createElement('tr');

        // Time Column
        const timeCell = document.createElement('td');
        timeCell.textContent = time;
        timeCell.style.fontWeight = 'bold';
        timeCell.style.backgroundColor = '#f0f0f0';
        row.appendChild(timeCell);

        // Days Columns
        DAYS.forEach(day => {
            const cell = document.createElement('td');
            const entry = data.find(d => d.day === day && d.time_slot === time);

            if (entry) {
                cell.textContent = entry.subject;
                cell.style.backgroundColor = '#e8f0fe'; // Light blue for filled
                cell.style.color = 'var(--primary-color)';
                cell.style.fontWeight = '500';
            } else {
                cell.textContent = '-';
                cell.style.color = '#ccc';
            }

            // Teacher Interaction
            if (role === 'Öğretmen') {
                cell.style.cursor = 'pointer';
                cell.title = 'Düzenlemek için tıklayın';
                cell.addEventListener('click', () => openEditModal(day, time, entry ? entry.subject : ''));
            }

            row.appendChild(cell);
        });

        scheduleBody.appendChild(row);
    });
}

// -- Edit Functionality (Teacher Only) --

function openEditModal(day, time, currentSubject) {
    editDayInput.value = day;
    editTimeInput.value = time;
    editSubjectInput.value = currentSubject === '-' ? '' : currentSubject;
    editScheduleModal.style.display = 'block';
}

if (closeScheduleBtn) {
    closeScheduleBtn.addEventListener('click', () => {
        editScheduleModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target == editScheduleModal) {
        editScheduleModal.style.display = 'none';
    }
});

if (scheduleForm) {
    scheduleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const day = editDayInput.value;
        const time = editTimeInput.value;
        const subject = editSubjectInput.value;

        // Upsert data
        const { error } = await _supabaseSchedule
            .from('schedule')
            .upsert({
                day: day,
                time_slot: time,
                subject: subject
            }, { onConflict: 'day, time_slot' });

        if (error) {
            alert('Kaydetme hatası: ' + error.message);
        } else {
            // Reload table
            editScheduleModal.style.display = 'none';
            loadScheduleData('Öğretmen'); // Reload as teacher
        }
    });
}

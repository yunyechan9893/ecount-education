export const DateConponent = {
    populateYears(yearSelect) {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 2000; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    },
    
    populateDays(year, month, daySelect) {
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (month === 2) { // February
            if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                daysInMonth[1] = 29;
            } else {
                daysInMonth[1] = 28;
            }
        }

        daySelect.innerHTML = '';

        for (let day = 1; day <= daysInMonth[month - 1]; day++) {
            const option = document.createElement('option');
            option.value = day.toString().padStart(2, '0');
            option.textContent = day.toString().padStart(2, '0');
            daySelect.appendChild(option);
        }
    }
}
/**
 * Finanzly - Lógica del Diagnóstico Financiero
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos - Formulario Financiero
    const financialForm = document.getElementById('financialForm');
    const resultSection = document.getElementById('resultSection');
    const diagnosisSection = document.getElementById('diagnosis');
    
    // Resultados
    const resTotalIncome = document.getElementById('resTotalIncome');
    const resTotalExpenses = document.getElementById('resTotalExpenses');
    const resBalance = document.getElementById('resBalance');
    const recommendationBox = document.getElementById('recommendationBox');
    const recommendationText = document.getElementById('recommendationText');
    const recommendationIcon = document.getElementById('recommendationIcon');
    const btnReset = document.getElementById('btnReset');

    // Referencias a elementos - Formulario de Contacto
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');

    /**
     * Formatear números a moneda local (COP/General)
     */
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    /**
     * Manejador del Formulario Financiero
     */
    financialForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener valores de los inputs
        const salary = parseFloat(document.getElementById('salary').value) || 0;
        const otherIncome = parseFloat(document.getElementById('otherIncome').value) || 0;
        const fixedExpenses = parseFloat(document.getElementById('fixedExpenses').value) || 0;
        const variableExpenses = parseFloat(document.getElementById('variableExpenses').value) || 0;
        const savings = parseFloat(document.getElementById('savings').value) || 0;
        const debts = parseFloat(document.getElementById('debts').value) || 0;
        const goal = document.getElementById('goal').value;

        // Cálculos
        const totalIncome = salary + otherIncome;
        const totalExpenses = fixedExpenses + variableExpenses;
        const balance = totalIncome - totalExpenses;

        // Mostrar Resultados
        resTotalIncome.textContent = formatCurrency(totalIncome);
        resTotalExpenses.textContent = formatCurrency(totalExpenses);
        resBalance.textContent = formatCurrency(balance);
        
        // Estilo del balance (rojo si es negativo)
        if (balance < 0) {
            resBalance.style.color = 'var(--danger)';
        } else {
            resBalance.style.color = 'var(--secondary)';
        }

        // Lógica de Recomendación
        generateRecommendation(totalIncome, totalExpenses, balance, savings, debts, goal);

        // Mostrar sección de resultados
        resultSection.classList.remove('hidden');
        diagnosisSection.classList.add('hidden');
        
        // Desplazarse al inicio de los resultados
        window.scrollTo({ top: resultSection.offsetTop - 100, behavior: 'smooth' });
    });

    /**
     * Motor de Recomendaciones
     */
    const generateRecommendation = (income, expenses, balance, savings, debts, goal) => {
        let text = "";
        let type = "primary"; // default blue
        let icon = "💡";

        // Regla 1: Gastos > Ingresos
        if (expenses > income) {
            text = "¡Alerta! Tus gastos están superando tus ingresos. Es crucial que revises tus gastos variables y busques áreas donde puedas recortar de inmediato para evitar el endeudamiento.";
            type = "warning";
            icon = "⚠️";
        } 
        // Regla 2: Deudas > Ahorros
        else if (debts > savings) {
            text = "Tus deudas totales superan tus ahorros actuales. Te recomendamos priorizar el pago de tus deudas (especialmente las de intereses altos) antes de enfocar tus excedentes en inversiones o compras grandes.";
            type = "warning";
            icon = "💳";
        }
        // Regla 3: Balance positivo pero ahorros < 3 meses de ingresos
        else if (balance > 0 && savings < (income * 3)) {
            const missing = (income * 3) - savings;
            text = `Tienes un balance positivo, lo cual es excelente. Sin embargo, tu fondo de emergencia es bajo. Recomendamos construir un fondo equivalente a 3 meses de ingresos (${formatCurrency(income * 3)}) antes de seguir con tu objetivo de ${goal}. Te faltan aproximadamente ${formatCurrency(missing)}.`;
            type = "primary";
            icon = "🛡️";
        }
        // Regla 4: Balance positivo y buen nivel de ahorro
        else if (balance > 0 && savings >= (income * 3)) {
            text = `¡Felicidades! Tienes una salud financiera sólida. Con un fondo de emergencia constituido y un balance mensual positivo, estás en una posición ideal para comenzar a invertir agresivamente o destinar más recursos a tu meta de ${goal}.`;
            type = "success";
            icon = "🚀";
        }
        else {
            text = "Tu situación es estable, pero te recomendamos mantener un registro estricto de tus gastos mensuales para optimizar tu capacidad de ahorro.";
            type = "primary";
            icon = "📊";
        }

        // Aplicar estilos a la caja de recomendaciones
        recommendationBox.className = `recommendation-box ${type}`;
        recommendationText.textContent = text;
        recommendationIcon.textContent = icon;
    };

    /**
     * Resetear formulario
     */
    btnReset.addEventListener('click', () => {
        financialForm.reset();
        resultSection.classList.add('hidden');
        diagnosisSection.classList.remove('hidden');
        window.scrollTo({ top: diagnosisSection.offsetTop - 100, behavior: 'smooth' });
    });

    /**
     * Manejador del Formulario de Contacto
     */
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validación básica ya manejada por HTML5 (required, type="email")
        // Pero capturamos el evento para simular el envío asíncrono
        
        const formData = new FormData(contactForm);
        const name = formData.get('contactName');

        console.log(`Simulando envío de mensaje de: ${name}`);

        // Mostrar mensaje de éxito
        contactForm.classList.add('hidden');
        contactSuccess.classList.remove('hidden');

        // Resetear después de 5 segundos para permitir otro envío si se desea
        setTimeout(() => {
            contactSuccess.classList.add('hidden');
            contactForm.classList.remove('hidden');
            contactForm.reset();
        }, 5000);
    });
});

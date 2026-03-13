/**
 * Finanzly - Lógica del Diagnóstico Financiero
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos - Formulario Financiero
    const financialForm = document.getElementById('financialForm');
    const resultSection = document.getElementById('resultSection');
    const diagnosisSection = document.getElementById('diagnosis');
    const formWarning = document.getElementById('formWarning');
    const warningText = document.getElementById('warningText');
    
    // Resultados
    const resTotalIncome = document.getElementById('resTotalIncome');
    const resTotalExpenses = document.getElementById('resTotalExpenses');
    const resBalance = document.getElementById('resBalance');
    const recommendationBox = document.getElementById('recommendationBox');
    const recommendationText = document.getElementById('recommendationText');
    const recommendationIcon = document.getElementById('recommendationIcon');
    const btnReset = document.getElementById('btnReset');



    /**
     * Formatear números a moneda colombiana (COP) en tiempo real
     */
    const formatCOP = (value) => {
        const number = value.replace(/\D/g, "");
        if (!number) return "";
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(number);
    };

    const parseCurrency = (value) => {
        return parseFloat(value.replace(/[^0-9-]/g, "")) || 0;
    };

    // Aplicar formateo a todos los inputs de clase .currency-input
    document.querySelectorAll('.currency-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const originalLength = e.target.value.length;
            
            const formatted = formatCOP(e.target.value);
            e.target.value = formatted;
            
            // Reajustar cursor (aproximado para mejor UX)
            const newLength = formatted.length;
            const diff = newLength - originalLength;
            e.target.setSelectionStart(cursorPosition + diff);
            e.target.setSelectionEnd(cursorPosition + diff);
        });
    });

    /**
     * Lógica de Objetivos por Horizonte
     */
    const goalOptions = {
        corto: [
            "Hacer un paseo",
            "Crear fondo de emergencia",
            "Pagar deudas pequeñas",
            "Comprar un electrodoméstico"
        ],
        mediano: [
            "Terminar estudios",
            "Comprar moto o vehículo",
            "Iniciar emprendimiento",
            "Ahorrar para cuota inicial"
        ],
        largo: [
            "Comprar casa",
            "Jubilación",
            "Independencia financiera",
            "Invertir en propiedades"
        ]
    };

    const horizonSelect = document.getElementById('horizonSelect');
    const goalSelect = document.getElementById('goalSelect');
    const goalSelectorWrapper = document.getElementById('goalSelectorWrapper');

    horizonSelect.addEventListener('change', () => {
        const horizon = horizonSelect.value;
        const options = goalOptions[horizon];
        
        // Limpiar y llenar dropdown de metas
        goalSelect.innerHTML = '<option value="" disabled selected>Selecciona un objetivo</option>';
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            goalSelect.appendChild(option);
        });
        
        goalSelectorWrapper.classList.remove('hidden');
    });

    goalSelect.addEventListener('change', () => {
        const horizon = horizonSelect.value;
        const goal = goalSelect.value;
        const item = document.getElementById(`item-${horizon}`);
        const hiddenInput = document.getElementById(`objetivo_${horizon}`);
        
        if (item && hiddenInput) {
            item.querySelector('.goal-value').textContent = goal;
            hiddenInput.value = goal;
        }
    });

    /**
     * Lógica de Selector de Bancos (Custom Select)
     */
    const bankSelector = document.getElementById('bankSelector');
    const bankSelected = bankSelector.querySelector('.select-selected');
    const bankItems = bankSelector.querySelector('.select-items');
    const bankInput = document.getElementById('bankName');

    bankSelected.addEventListener('click', (e) => {
        e.stopPropagation();
        bankItems.classList.toggle('select-hide');
        bankSelector.classList.toggle('select-arrow-active');
    });

    bankItems.querySelectorAll('div').forEach(item => {
        item.addEventListener('click', () => {
            const value = item.getAttribute('data-value');
            const content = item.innerHTML;
            
            bankSelected.innerHTML = content;
            bankInput.value = value;
            
            bankItems.classList.add('select-hide');
            bankSelector.classList.remove('select-arrow-active');
        });
    });

    document.addEventListener('click', () => {
        bankItems.classList.add('select-hide');
        bankSelector.classList.remove('select-arrow-active');
    });

    /**
     * Contador de Caracteres para el Mensaje de Consulta
     */
    const contactMessage = document.getElementById('contactMessage');
    const charCount = document.getElementById('charCount');

    if (contactMessage && charCount) {
        contactMessage.addEventListener('input', () => {
            const currentLength = contactMessage.value.length;
            charCount.textContent = currentLength;
            
            // Cambiar el color si se acerca al límite o lo alcanza (opcional visualmente, ya que maxlength protege el input nativamente)
            if (currentLength >= 150) {
                charCount.style.color = 'var(--danger)';
            } else {
                charCount.style.color = 'var(--text-muted)';
            }
        });
    }

    /**
     * Manejador del Formulario Financiero Unificado
     */
    financialForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Limpiar estilos de error
        const allInputs = financialForm.querySelectorAll('input, select');
        allInputs.forEach(input => input.style.borderColor = '');

        let isFormValid = true;
        let missingContactFields = false;
        let invalidEmail = false;
        let invalidPhone = false;

        // Validar campos requeridos
        const requiredInputs = financialForm.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isFormValid = false;
                input.style.borderColor = 'var(--danger)';
                // Verificar si es de la sección de contacto
                if (['contactName', 'contactEmail', 'contactPhone'].includes(input.id)) {
                    missingContactFields = true;
                }
            }
        });

        // Validar Email
        const email = document.getElementById('contactEmail').value.trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            isFormValid = false;
            invalidEmail = true;
            document.getElementById('contactEmail').style.borderColor = 'var(--danger)';
        }

        // Validar Teléfono
        const phone = document.getElementById('contactPhone').value.trim();
        if (phone && !/^[0-9]+$/.test(phone)) {
            isFormValid = false;
            invalidPhone = true;
            document.getElementById('contactPhone').style.borderColor = 'var(--danger)';
        }

        // Mostrar Advertencias si la validación falla
        if (!isFormValid) {
            if (missingContactFields) {
                warningText.textContent = "Para ver tu análisis financiero personalizado, por favor completa primero tus datos de contacto.";
            } else if (invalidEmail) {
                warningText.textContent = "El correo electrónico no tiene un formato válido.";
            } else if (invalidPhone) {
                warningText.textContent = "El número de teléfono solo debe contener números.";
            } else {
                warningText.textContent = "Por favor, completa todos los campos marcados como obligatorios.";
            }
            formWarning.classList.remove('hidden');
            
            // Autoestilar caja para saltar a la vista
            formWarning.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return; // Bloquea el envío y visualización
        }

        // Si es válido
        formWarning.classList.add('hidden');

        // Obtener valores limpios
        const salary = parseCurrency(document.getElementById('salary').value);
        const otherIncome = parseCurrency(document.getElementById('otherIncome').value);
        const fixedExpenses = parseCurrency(document.getElementById('fixedExpenses').value);
        const variableExpenses = parseCurrency(document.getElementById('variableExpenses').value);
        const savings = parseCurrency(document.getElementById('savings').value);
        const debts = parseCurrency(document.getElementById('debts').value);
        
        // Objetivo principal para la recomendación
        const goal = (document.getElementById('objetivo_largo').value || 
                      document.getElementById('objetivo_mediano').value || 
                      document.getElementById('objetivo_corto').value || "tu meta");

        // Cálculos
        const totalIncome = salary + otherIncome;
        const totalExpenses = fixedExpenses + variableExpenses;
        const balance = totalIncome - totalExpenses;

        // Mostrar Resultados locales
        resTotalIncome.textContent = formatCOP(totalIncome.toString());
        resTotalExpenses.textContent = formatCOP(totalExpenses.toString());
        resBalance.textContent = formatCOP(balance.toString());
        
        if (balance < 0) {
            resBalance.style.color = 'var(--danger)';
        } else {
            resBalance.style.color = 'var(--secondary)';
        }

        generateRecommendation(totalIncome, totalExpenses, balance, savings, debts, goal);
        
        resultSection.classList.remove('hidden');
        diagnosisSection.classList.add('hidden');
        window.scrollTo({ top: resultSection.offsetTop - 100, behavior: 'smooth' });

        // Enviar a Formspree usando Fetch para no recargar la página
        const formData = new FormData(financialForm);
        try {
            await fetch(financialForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            console.log("Formulario enviado a Formspree con éxito");
        } catch (error) {
            console.error("Error enviando a Formspree:", error);
        }
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
            text = `Tienes un balance positivo, lo cual es excelente. Sin embargo, tu fondo de emergencia es bajo. Recomendamos construir un fondo equivalente a 3 meses de ingresos (${formatCOP((income * 3).toString())}) antes de seguir con tu objetivo de ${goal}. Te faltan aproximadamente ${formatCOP(missing.toString())}.`;
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
        
        // Limpiar el selector de bancos
        const bankSelected = document.querySelector('.select-selected');
        bankSelected.innerHTML = 'Selecciona tu banco';
        
        // Limpiar objetivos seleccionados
        document.querySelectorAll('.goal-value').forEach(el => el.textContent = 'No seleccionado');
        document.getElementById('goalSelectorWrapper').classList.add('hidden');
        document.getElementById('goalSelect').innerHTML = ''; // Limpiar dropdown

        // Limpiar el contador de caracteres si existe
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = 'var(--text-muted)';
        }

        resultSection.classList.add('hidden');
        diagnosisSection.classList.remove('hidden');
        window.scrollTo({ top: diagnosisSection.offsetTop - 100, behavior: 'smooth' });
    });
});

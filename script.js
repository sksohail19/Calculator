const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const specialChars = ["*", "/", "-", "+", "%"];
let output = "";

const calculate = (btnValue) => {
    if (btnValue === "=" && output !== "") {
        output = parseExpression(output);
    } else if (btnValue === "AC") {
        output = "";
    } else if (btnValue === "DEL") {
        output = output.toString().slice(0, -1);
    } else {
        if (output === "" && specialChars.includes(btnValue) && btnValue !== "-") return;

        if (btnValue === "-") {
            const lastChar = output.slice(-1);
            if (output === "" || specialChars.includes(lastChar)) {
                output += btnValue;
                display.value = output;
                return;
            }
        }

        if (btnValue === "." && output.includes(".")) {
            const lastNumber = output.split(/[*\/\+\-%]/).pop();
            if (lastNumber.includes(".")) return;
        }

        output += btnValue;
    }
    display.value = output;
};

const parseExpression = (expression) => {
    expression = expression.replace(/(\d+)%/g, (match, number) => parseFloat(number) / 100);

    const tokens = expression.match(/-?\d+(\.\d+)?|[-+*/%]/g);
    if (!tokens || tokens.length < 3) return "";

    let result = parseFloat(tokens[0]);

    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const nextValue = parseFloat(tokens[i + 1]);

        if (isNaN(nextValue)) return "Error: Invalid Input";

        if (operator === "+") result += nextValue;
        else if (operator === "-") result -= nextValue;
        else if (operator === "*") result *= nextValue;
        else if (operator === "/") {
            if (nextValue === 0) return "Error: Division by 0";
            result /= nextValue;
        }
        else if (operator === "%") result %= nextValue;
    }
    return Math.round(result * 10000) / 10000;
};

buttons.forEach(button => {
    button.addEventListener("click", (e) => calculate(e.target.dataset.value));
});

document.addEventListener("keydown", (e) => {
    if (e.key >= 0 && e.key <= 9) {
        calculate(e.key);
    } else if (specialChars.includes(e.key)) {
        calculate(e.key);
    } else if (e.key === "Enter" || e.key === "=") {
        calculate("=");
    } else if (e.key === "Backspace") {
        calculate("DEL");
    } else if (e.key === "Escape") {
        calculate("AC");
    } else if (e.key === ".") {
        calculate(".");
    } else if (e.key === "-") {
        calculate("-");
    }
});

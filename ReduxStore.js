// Redux
const CLEAR = "CLEAR";
const CALCULATE = "CALCULATE";
const SET_FORMULA = "SET_FORMULA";
const SET_CURRENT = "SET_CURRENT";

export const clearAction = () => ({
    type: CLEAR,
});

export const calculateAction = (result) => ({
    type: CALCULATE,
    result,
});

export const setFormulaAction = (value) => ({
    type: SET_FORMULA,
    value,
});

export const setCurrentAction = (value, isClear = false) => ({
    type: SET_CURRENT,
    value,
    isClear,
});

const defaultState = {
    formula: "",
    currentValue: "0",
};
const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_FORMULA:
            if (state.currentValue.includes(".") && action.value == ".") {
                if (state.formula.endsWith(".")) {
                    return state;
                }
                return {
                    ...state,
                    formula: state.formula + action.value,
                };
            } else if (
                (state.formula.endsWith("+") ||
                    state.formula.endsWith("-") ||
                    state.formula.endsWith("*") ||
                    state.formula.endsWith("/")) &&
                (action.value == "+" ||
                    action.value == "*" ||
                    action.value == "/")
            ) {
                if (state.formula.endsWith("-")) {
                    return {
                        ...state,
                        formula: state.formula.slice(0, -2) + action.value,
                    };
                }
                return {
                    ...state,
                    formula: state.formula.slice(0, -1) + action.value,
                };
            }
            return {
                ...state,
                formula: state.formula + action.value,
            };
        case SET_CURRENT:
            if (state.currentValue.includes(".") && action.value == ".") {
                return state;
            }
            if (action.isClear || state.currentValue == 0) {
                return {
                    ...state,
                    currentValue: action.value,
                };
            }
            return {
                ...state,
                currentValue: state.currentValue + action.value,
            };
        case CLEAR:
            return defaultState;
        case CALCULATE:
            return {
                ...state,
                currentValue: action.result + "",
                formula: action.result + "",
            };
        default:
            return state;
    }
};
export const store = Redux.createStore(reducer);

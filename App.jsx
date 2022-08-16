import { buttonList } from "./buttonObj.js";
import {
    store,
    clearAction,
    calculateAction,
    setFormulaAction,
    setCurrentAction,
} from "./ReduxStore.js";
const { useState, useEffect } = React;
const { Provider, connect } = ReactRedux;
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Screen(props) {
    return (
        <div id="screen">
            <p className="formula">
                {props.formula.replaceAll("*", "×").replaceAll("/", "÷")}
            </p>
            <p className="latest-button" id="display">
                {props.currentValue.replaceAll("*", "×").replaceAll("/", "÷")}
            </p>
        </div>
    );
}

const ScreenConnected = connect(
    (state) => state,
    () => {}
)(Screen);

function Button(props) {
    return (
        <button id={props.id} value={props.name} className={props.className}>
            {props.name}
        </button>
    );
}

function ButtonBlock(props) {
    useEffect(() => {
        [...$$(".button")].forEach((button) => {
            button.addEventListener("click", (event) => {
                let value = event.target.getAttribute("value");
                switch (value) {
                    case "AC":
                        props.acClick();
                        break;
                    case "=":
                        props.equalClick(
                            math.evaluate(store.getState().formula)
                        );
                        break;
                    case "+":
                    case "-":
                    case "×":
                    case "÷":
                        if (value == "×") {
                            value = "*";
                        } else if (value == "÷") {
                            value = "/";
                        }
                        props.appendFormula(value);
                        props.defaultClick(value, true);
                        break;
                    case ".":
                    default:
                        if (
                            store.getState().formula.endsWith("+") ||
                            store.getState().formula.endsWith("-") ||
                            store.getState().formula.endsWith("*") ||
                            store.getState().formula.endsWith("/")
                        ) {
                            props.defaultClick(value, true);
                        } else {
                            props.defaultClick(value);
                        }
                        props.appendFormula(value);
                        break;
                }
            });
        });
    }, []);
    return (
        <div className="button-block">
            {buttonList.map((button, index) => (
                <Button
                    key={index}
                    className={button.className}
                    id={button.id}
                    name={button.name}
                />
            ))}
        </div>
    );
}

const ButtonBlockConnected = connect(
    (state) => state,
    (dispatch) => {
        return {
            acClick: () => {
                dispatch(clearAction());
            },
            equalClick: (result) => {
                dispatch(calculateAction(result));
            },
            appendFormula: (value) => {
                dispatch(setFormulaAction(value));
            },
            defaultClick: (value, isClear) => {
                dispatch(setCurrentAction(value, isClear));
            },
        };
    }
)(ButtonBlock);

function App(props) {
    return (
        <Provider store={store}>
            <div id="calculator">
                <ScreenConnected />
                <ButtonBlockConnected />
            </div>
        </Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

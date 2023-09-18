import { useReducer } from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import "./css/style.css"

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.doneEvaluate) {
        return {
          ...state,
          doneEvaluate: false,
          currenOperand: payload.digit
        }
      }
      if (payload.digit === "0" && state.currenOperand === "0") return state
      if (payload.digit === "." && state.currenOperand.includes(".")) return state
      return {
        ...state,
        currenOperand: `${state.currenOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.currentOperand == null) return state
      if (state.currenOperand.length === 1) {
        return {
          ...state,
          currenOperand: null
        }
      }
      return {
        ...state,
        currenOperand: state.currenOperand.slice(0, -1)
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currenOperand == null && state.previousOperand == null) return state
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currenOperand,
          currenOperand: null
        }
      }
      if (state.currenOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currenOperand: null
      }
    case ACTIONS.EVALUATE:
      if (state.currenOperand == null || state.previousOperand == null || state.operation == null) {
        return state
      }

      return {
        ...state,
        doneEvaluate: true,
        previousOperand: null,
        operation: null,
        currenOperand: evaluate(state)
      }
  }
}

function evaluate({ previousOperand, currenOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currenOperand)
  let computation = ""
  if (isNaN(prev) || isNaN(current)) return
  switch (operation) {
    case '+':
      computation = prev + current
      break
    case '-':
      computation = prev - current
      break
    case '*':
      computation = prev * current
      break
    case '/':
      computation = prev / current
      break
    default:
      return
  }
  return computation.toString()
}

function App() {
  const [{ currenOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{previousOperand}{operation}</div>
        <div className="current-operand">{currenOperand}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button class="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `keypad-input`
 * Keypad input for Touchscreen devices like a Kiosk
 * ### Styling
 *
 * `<paper-button>` provides the following custom properties and mixins
 * for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--keypad-input-color` | Input font color and 60% opacity for placeholder | `#004`
 * `--keypad-input-padding` | Input Padding | `8px`
 * `--keypad-button-height` | Button Padding | `2.5em`
 * `--keypad-button-background` | Button Background | ` #f0ecec`
 * `--keypad-button-disabled-background` | Disabled Button Background | ` #ccc`
 * `--keypad-button-border` | Button Border | `0`
 * `--keypad-button-margin` | Button Margin | `5px`
 * `--keypad-button-padding` | Button Padding | `8px`
 * `--keypad-button-border-radius` | Button Border radius | `3px`
 * `--primary-color` | Primary font color for Button | `#565361`
 * `--disabled-color` | Disabled font color for Button | `#565361`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class KeypadInput extends PolymerElement {
  constructor() {
    super();
    this.setAttribute('tabindex',1);
  }
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          margin: 10px;
          padding: 10px;
          min-width: 180px;
        }


        #input {
          display: block;
          border: 0;
          font-size: inherit;
          border-bottom: 1px solid #999;
          outline: none;
          margin-bottom: 20px;
          color: var(--keypad-input-color, #004);
          width: 100%;
          padding: var(--keypad-input-padding, 8px);
          box-sizing: border-box;
        }

          #input::-moz-placeholder {
            color: var(--keypad-input-color, #004);
            opacity: 0.8;
          }
          #input::-webkit-input-placeholder{
            color: var(--keypad-input-color, #004);
            opacity: 0.8;
          }
          #input:-ms-input-placeholder {
            color: var(--keypad-input-color, #004);
            opacity: 0.8;
          }

        #input[hidden] {
          display: none;
        }

        .keypad .row {
          display: flex;
          flex-direction: row;
        }

        .row > button {
          height: var(--keypad-button-height, 2.5em);
          flex-grow: 1;
          background: var(--keypad-button-background, #f0ecec);
          margin: var(--keypad-button-margin, 5px);
          border: var(--keypad-button-border, 0);
          border-radius: var(--keypad-button-border-radius, 3px);
          padding: var(--keypad-button-padding, 8px);
          min-width: calc(33.34% - (2 * var(--keypad-button-margin, 5px)));
          outline: none;
          box-sizing: border-box;
          user-select: none;
          font-size: inherit;
          color: var(--primary-color, #565361);
          box-shadow: 0 1px 4px -3px #000;
        }
        .row > button[disabled]  {
          opacity: 0.6;
          color: var(--disabled-color, #565361);
          background: var(--keypad-button-disabled-background, #ccc);
          box-shadow: none;
        }
        .row > button:hover:not([disabled]):not(:active) {
          box-shadow: 0 1px 6px -3px #000;
        }
        .row > button:active {
          box-shadow: none;
        }
      </style>
      <div class="container">
        <input type="[[__inptType]]" id="input" on-click="__focusRoot" pattern="[0-9].[0-9]" readonly value="[[__value]]" placeholder="[[placeholder]]" tabindex="-1" hidden$="[[inputHidden]]" />
        <div class="keypad" on-click="__handleKeyPadClick">
          <div class="row">
            <button tabindex="-1" data-action="1">1</button>
            <button tabindex="-1" data-action="2">2</button>
            <button tabindex="-1" data-action="3">3</button>
          </div>
          <div class="row">
            <button tabindex="-1" data-action="4">4</button>
            <button tabindex="-1" data-action="5">5</button>
            <button tabindex="-1" data-action="6">6</button>
          </div>
          <div class="row">
            <button tabindex="-1" data-action="7">7</button>
            <button tabindex="-1" data-action="8">8</button>
            <button tabindex="-1" data-action="9">9</button>
          </div>

          <div class="row">
            <button tabindex="-1" data-action="decimal" disabled$="[[disableDecimal]]">.</button>
            <button tabindex="-1" data-action="0">0</button>
            <button tabindex="-1" data-action="backspace">⟵</button>
          </div>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {
      /** The output for the value entered */
      value: {
        type: String,
        notify: true,
        computed: "__exportValue(__value)"
      },
      __value: {
        type: String,
        notify: true,
        value: ""
      },
      /** Making this true hides the inbuit input */
      inputHidden: {
        type: Boolean,
        value: false
      },
      /** This hides the input and replaces the characters with * */
      secret: {
        type: Boolean,
        value: false
      },
      /** Limit for entering the characters */
      charLimit: {
        type: Number,
        value: 8
      },
      /** Placeholder for the inbuilt input */
      placeholder: {
        type: String,
        value: "Enter PIN"
      },
      /** Disables the decimal button on keypad */
      disableDecimal: {
        type: Boolean,
        value: !1
      },
      __inptType: {
        type: String,
        computed: "__computeInpType(secret)"
      }
    };
  }
  __handleKeyPadClick(e) {
    const totalButtons = new Array(...this.shadowRoot.querySelectorAll(".keypad > .row > button"));
    const target = e.path ? e.path[0] : e.target;
    if(totalButtons.filter(b => b==target).length) {
      switch(e.target.dataset['action']) {
        case "decimal":
          if(!this.disableDecimal && this.__value && this.__value.indexOf(".")==-1)
            this.set("__value", this.__value + ".");
          break;
        case "backspace":
            this.__deleteFromValue(1);
          break
        default:
         this.__addToValue(e.target.dataset['action']);
      }
     }
  }

  __validateNativeInput(e) {
    if(e.key in ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]) {
      this.__addToValue(e.key)
    }
    else if (e.key == ".") {
      if(!this.disableDecimal && this.__value && this.__value.indexOf(".")==-1)
        this.set("__value", this.__value + ".");
    }
    else if (e.key == "Backspace") {
      this.__deleteFromValue(1);
      e.preventDefault() // This is to handle history goBack
    }
    else if (e.key == "Delete") {
      if(e.code == "NumpadDecimal"){
          if(!this.disableDecimal && this.__value && this.__value.indexOf(".")==-1)
            this.set("__value", this.__value + ".");
      }
      else
        this.__deleteFromValue(1);
    } else if(e.key=="Enter") {
      /**
     * Fired when "Enter" key is pressed
     *
     * @event keypad-submit
     * @param {number} value Current Value.
     */
      this.dispatchEvent(new CustomEvent("keypad-submit", {
        value: this.value
      }))
    }
  }
  __addToValue(v) {
    const numWithoutDecimal = this.__value.split(".").join("");
     if(this.charLimit && numWithoutDecimal.length < this.charLimit)
       this.set("__value", this.__value + v);
  }
  __deleteFromValue(n) {
    if(this.__value.length)
      this.set("__value",  this.__value.slice(0, this.__value.length-n));
  }
  __exportValue(v) {return v}

  __computeInpType(f) {
    return f?"password":"text";
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.__validateNativeInput)
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.__validateNativeInput)

  }
  __focusRoot() {
    this.focus();
  }
}

window.customElements.define('keypad-input', KeypadInput);

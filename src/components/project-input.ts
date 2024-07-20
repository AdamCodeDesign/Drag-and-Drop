import { Component } from "./base-component.js";
import { Validatable, validate } from "../util/validation.js";
import { projectState } from "../state/project-state.js";


export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
  
    constructor() {
      super("project-input", "app", true, "user-input");
  
      this.titleInputElement = this.element.querySelector(
        "#title"
      ) as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector(
        "#description"
      ) as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector(
        "#people"
      ) as HTMLInputElement;
  
      this.configure();
    }
    configure() {
      this.element.addEventListener("submit", this.submitHandler);
    }
  
    renderContent() {}
  
    private gatherUserInput(): [string, string, number] | void {
      const enterTitle = this.titleInputElement.value;
      const enterDescription = this.descriptionInputElement.value;
      const enterPeople = this.peopleInputElement.value;
  
      const titleValidatable: Validatable = {
        value: enterTitle,
        required: true,
      };
      const descriptionValidatable: Validatable = {
        value: enterDescription,
        required: true,
        minLength: 5,
      };
      const peopleValidatable: Validatable = {
        value: +enterPeople,
        required: true,
        min: 1,
        max: 5,
      };
      if (
        !validate(titleValidatable) ||
        !validate(descriptionValidatable) ||
        !validate(peopleValidatable)
      ) {
        alert("Incorrect input, please try again!");
        return;
      } else {
        return [enterTitle, enterDescription, +enterPeople];
      }
    }
  
    private clearInputs() {
      this.titleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.peopleInputElement.value = "";
    }
  
    private submitHandler = (event: Event) => {
      event.preventDefault();
      const userInput = this.gatherUserInput();
      if (Array.isArray(userInput)) {
        const [title, desc, people] = userInput;
        projectState.addProject(title, desc, people);
        this.clearInputs();
      }
    };
  }
import { Component } from "./base-component.js";
import { DragTarget } from "../models/interfaces.js";
import { Project, ProjectStatus } from "../models/project.js";
import { projectState } from "../state/project-state.js";
import { ProjectItem } from "./project-item.js";



export class ProjectList
extends Component<HTMLDivElement, HTMLElement>
implements DragTarget
{
assignedProjects: Project[];

constructor(private type: "active" | "finished") {
  super("project-list", "app", false, `${type}-projects`);

  this.assignedProjects = [];
  this.configure();
  this.renderContent();
}

dragOverHandler = (event: DragEvent) => {
  if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
    event.preventDefault();
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.add("droppable");
  }
};

dropHandler = (event: DragEvent) => {
  const prjId = event.dataTransfer!.getData("text/plain");
  projectState.moveProject(
    prjId,
    this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
  );
};

dragLeaveHandler = (event: DragEvent) => {
  const listEl = this.element.querySelector("ul")!;
  listEl.classList.remove("droppable");
};

configure() {
  this.element.addEventListener("dragover", this.dragOverHandler);
  this.element.addEventListener("drop", this.dropHandler);
  this.element.addEventListener("dragleave", this.dragLeaveHandler);
  projectState.addListener((projects: Project[]) => {
    const relevantProject = projects.filter((prj) => {
      if (this.type === "active") {
        return prj.status === ProjectStatus.Active;
      }
      return prj.status === ProjectStatus.Finished;
    });
    this.assignedProjects = relevantProject;
    this.renderProjects();
  });
}
renderContent() {
  const listId = `${this.type}-projects-list`;
  this.element.querySelector("ul")!.id = listId;
  this.element.querySelector("h2")!.textContent =
    this.type.toUpperCase() + " PROJECTS";
}

private renderProjects() {
  const listEl = document.getElementById(
    `${this.type}-projects-list`
  )! as HTMLUListElement;
  listEl.innerHTML = "";
  for (const prjItem of this.assignedProjects) {
    new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
  }
}
}
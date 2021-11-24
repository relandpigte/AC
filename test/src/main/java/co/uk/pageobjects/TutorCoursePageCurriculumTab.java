package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.Tab;
import co.uk.webelements.TextBox;

public class TutorCoursePageCurriculumTab {
	
	private static Tab curriculumTabIsActive = new Tab("Curriculum",By.xpath("//a[contains(@class,'active') and text()='Curriculum']"));
	private static Button addLesson = new Button("Add Lesson",By.xpath("//button[contains(text(),'Add Lesson')]"));
	private static Button addModule = new Button("Add Module",By.xpath("//button[contains(text(),'Add Module')]"));
	private static Element curriculumItem(String type,String name) {
		return new Element(type+": "+name,By.xpath("//a[text()='"+name+"']"));
	}
	
	private static Element addNewItem = new Element("Add",By.xpath("//div[@class='actions mt-n2 mb-4']//a[text()='Add ']"));
	private static Element addNewLesson = new Element("Add lesson",By.xpath("//div[contains(@class,'show')]/a[text()=' Add Lesson ']"));
	private static Element addNewModule = new Element("Add module",By.xpath("//div[contains(@class,'show')]/a[text()=' Add Module ']"));
	
	//private static Element addNewItemWithinModule = new Element("Add",By.xpath("//div[@dragula='Course']//a[text()='Add ']"));
	private static Element addNewItemWithinModule(String moduleName) {
		return new Element("Add",By.xpath("//a[text()='"+moduleName+"']/following::a[text()='Add '][1]"));
	}
	
	
	private static Element addLessonWithinModule = new Element("Add lesson within module",By.xpath("//div[@dragula='Course']//a[text()=' Add Lesson ']"));
	private static Element addUnitWithinModule = new Element("Add unit within module",By.xpath("//div[@dragula='Course']//a[text()=' Add Unit ']"));
	
	private static Element addNewItemWithinUnit(String unit) {
		return new Element("Add",By.xpath("//a[text()='"+unit+"']/following::a[text()='Add '][1]"));
	}
	private static Element addNewLessonWithinUnit(String unitName) {
		return new Element("Add lesson within unit "+unitName,By.xpath("//a[text()='"+unitName+"']//following::a[text()=' Add Lesson '][1]"));
	}
	
	private static Element nestedItem(String parent, String child) {
		return new Element(child+" within "+ parent,By.xpath("//a[text()='"+parent+"']/following::a[text()='"+child+"']"));
	}
	public static void clickAddNewLessonWithinUnit(String unitName) {
		addNewItemWithinUnit(unitName).click();
		addNewLessonWithinUnit(unitName).click();
	}
	
	public static void clickAddNewUnitWithinModule(String moduleName) {
		addNewItemWithinModule(moduleName).click();
		addUnitWithinModule.click();
	}
	
	public static void clickAddnewLessonWithinModule(String moduleName) {
		addNewItemWithinModule(moduleName).click();
		addLessonWithinModule.click();
	}
	
	public static void clickAddnewModule() {
		addNewItem.click();
		addNewModule.click();
		
	}
	
	public static void clickAddnewLesson() {
		addNewItem.click();
		addNewLesson.click();
	}
	
	public static void verifyCirriculumNestedItemIsDisplayed(String parent,String child) {
		nestedItem(parent, child).verifyDisplayed();
	}
	
	public static void verifyCurriculumItemIsDisplayed(String type,String name) {
		curriculumItem(type,name).verifyDisplayed();
	}
	
	public static void verifyCurriculumTabIsActive() {
		curriculumTabIsActive.verifyDisplayed();
	}
	
	public static void clickAddLesson() {
		addLesson.click();
	}
	
	public static void clickAddModule() {
		addModule.click();
	}
	
	public static class LessonModal{
		
		private static Element template(String template) {
			return new Element("Template: " + template, By.xpath("//p[text()='" + template + "']//parent::Button"));
		}
		private static Button next = new Button("Next",By.xpath("//button[text()=' Next ']"));
		private static TextBox lessonNameTxtBox = new TextBox("Lesson name",By.xpath("//app-lesson-wizard//input[@id='name']"));
		private static Button save = new Button("Save",By.xpath("//app-lesson-wizard//button[text()=' Save ']"));
		
		public static void clickTemplate(String template) {
			template(template).click();
		}
		
		public static void clickNext() {
			next.click();
		}
		
		public static void enterLessonName(String lessonName) {
			lessonNameTxtBox.setText(lessonName);
		}
		
		public static void clickSave() {
			save.click();
		}
	}
	
	public static class ModuleModal{
		
		private static TextBox ModuleNameTxtBox = new TextBox("Module",By.xpath("//app-lesson-wizard//input[@id='name']"));
		private static Button save = new Button("Save",By.xpath("//app-lesson-wizard//button[text()=' Save ']"));
		
		public static void enterModuleName(String moduleName) {
			ModuleNameTxtBox.setText(moduleName);
		}
		
		public static void clickSave() {
			save.click();
		}
	}
	
	public static class UnitModal{

		private static TextBox unitNameTxtBox = new TextBox("Unit name",By.xpath("//app-lesson-wizard//input[@id='name']"));
		private static Button save = new Button("Save",By.xpath("//app-lesson-wizard//button[text()=' Save ']"));
		
		public static void enterLessonName(String unitName) {
			unitNameTxtBox.setText(unitName);
		}
		
		public static void clickSave() {
			save.click();
		}
	}
}

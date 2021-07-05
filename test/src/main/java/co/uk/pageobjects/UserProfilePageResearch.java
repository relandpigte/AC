package co.uk.pageobjects;

import org.openqa.selenium.By;

import co.uk.core.DriverHandler;
import co.uk.webelements.Button;
import co.uk.webelements.Element;
import co.uk.webelements.ListBox;
import co.uk.webelements.TextBox;

public class UserProfilePageResearch {

	private static Button addResearchInterestBtn = new Button("Add Research Interest",By.xpath("//button[contains(text(),'Add Research Interest')]"));
	private static Button addMethodologyBtn = new Button("Add Methodology",By.xpath("//button[contains(text(),'Add Methodology')]"));
	private static Button addPublicationBtn = new Button("Add Publication",By.xpath("//button[contains(text(),'Add Publication')]"));
	private static TextBox filterPublication = new TextBox("Filter publication",By.xpath("//app-publications//input[@id='SearchFilter']"));
	private static Button removeResearchInterest(String title) {
		return new Button(title+" Remove",By.xpath("//app-interests//h4[text()='"+title+"']/ancestor::tr//span[contains(@class,'trash')]"));
	}
	
	private static Button editResearchIntereset(String title) {
		return new Button(title+" Edit",By.xpath("//app-interests//h4[text()='"+title+"']/ancestor::tr//span[contains(@class,'edit')]"));
	}
	
	private static Button removeMethodology(String title) {
		return new Button(title+" Remove",By.xpath("//app-methodologies//h4[text()='"+title+"']/ancestor::tr//span[contains(@class,'trash')]"));
	}
	
	private static Button editMethodology(String title) {
		return new Button(title+" Edit",By.xpath("//app-methodologies//h4[text()='"+title+"']/ancestor::tr//span[contains(@class,'edit')]"));
	}
	
	private static Button editPublication(String title) {
		return new Button(title+" Edit",By.xpath("//app-publications//h4[text()='"+title+"']/ancestor::tr//span[contains(@class,'edit')]"));
	}
	
	private static Button removePublication(String title) {
		return new Button(title+" Remove",By.xpath("//app-publications//h4[text()='"+title+"']/ancestor::tr//span[contains(@class,'trash')]"));
	}
	
	private static Element researchInterstTitle(String title) {
		return new Element(title,By.xpath("//app-interests//h4[text()='"+title+"']"));
	}
	private static Element methodologyTitle(String title) {
		return new Element(title,By.xpath("//app-methodologies//h4[text()='"+title+"']"));
	}
	private static Element publicationTitle(String title) {
		return new Element(title,By.xpath("//app-publications//h4[text()='"+title+"']"));
	}
	
	public static void clickRemoveResearchInterest(String title) {
		removeResearchInterest(title).click();
	}
	
	public static void clickEditResearchInterest(String title) {
		editResearchIntereset(title).click();
	}
	
	public static void clickRemoveMethodology(String title) {
		removeMethodology(title).click();
	}
	
	public static void clickEditMethodology(String title) {
		editMethodology(title).click();
	}
	
	public static void clickEditPublication(String title) {
		editPublication(title).click();
	}
	
	public static void clickRemovePublication(String title) {
		removePublication(title).click();
	}
	
	public static void verifyResearchInterestIsDisplayed(String title) {
		researchInterstTitle(title).verifyDisplayed();
	}
	
	public static void verifyResearchInterestIsNotDisplayed(String title) {
		researchInterstTitle(title).verifyNotDisplayed();
	}
	
	public static void verifyMethodologyIsDisplayed(String title) {
		methodologyTitle(title).verifyDisplayed();
	}
	
	public static void verifyMethodologyIsNotDisplayed(String title) {
		methodologyTitle(title).verifyNotDisplayed();
	}
	
	public static void verifyPublicationIsDisplayed(String title) {
		publicationTitle(title).verifyDisplayed();
	}
	
	public static void verifyPublicationIsNotDisplayed(String title) {
		publicationTitle(title).verifyNotDisplayed();
	}
	
	public static void clickAddResearchInterest() {
		addResearchInterestBtn.click();
	}
	
	public static void clickAddMethodology() {
		addMethodologyBtn.click();
	}
	
	public static void clickAddPublication() {
		addPublicationBtn.click();
	}
	
	public static void filterPublication(String title) {
		filterPublication.setTextAndEnter(title);
	}
	
	public static class ResearchInterestModal{
		
		private static Element modalTitle(String title) {
			return new Element(title,By.xpath("//app-create-edit-interest//h4[contains(text(),'"+title+"')]"));
		}
		
		private static TextBox titleTextbox = new TextBox("Title",By.xpath("//app-create-edit-interest//input[@id='Title']"));
		private static TextBox descriptionTextBox = new TextBox("Description",By.xpath("//app-create-edit-interest//div[contains(@class,'ql-editor')]/p"));
		private static TextBox knowledgeBaseTextBox = new TextBox("Knowledge base",By.xpath("//app-create-edit-interest//input[@id='DisciplineTaxonomies']"));
		private static Element knowlegeBaseDropDown = new Element("Knowledge dropdown",By.xpath("//typeahead-container//button"));
		
		private static Button save = new Button("Save",By.xpath("//app-create-edit-interest//button[@type='submit']"));
		 private static Element knowledgeBaseAlert(String knowledge) {
	        	return new Element("Knowledge base: "+knowledge,By.xpath("//app-create-edit-interest//div[contains(@class,'ac-alerts')]//div[contains(text(),'"+knowledge+"')]"));
	        }
		public static void verifyModalTitle(String title) {
			modalTitle(title).verifyDisplayed();
		}
		
		public static void verifyKnowledgeBaseIsDisplayed(String value) {
			knowledgeBaseAlert(value).verifyDisplayed();
		}
		
		public static void verifyTitleValueIsCorrect(String value) {
			titleTextbox.verifyAttributeContains("value", value);
		}
		
		public static void veriftyDescriptionValueIsCorrect(String value) {
			descriptionTextBox.verifyTextContains(value);
		}
		
		public static void enterTitle(String title) {
			titleTextbox.setText(title);
		}
		
		public static void enterDescription(String details) {
			descriptionTextBox.setText(details);
		}
		
		public static void enterFreeKnowldegeBase(String knowledgeBase) {
			knowledgeBaseTextBox.setText(knowledgeBase);
		}
		
		public static void enterAndSelectKnowledgeBase(String knowledgeBase) {
			knowledgeBaseTextBox.setText(knowledgeBase);
			DriverHandler.delay(4);
			knowlegeBaseDropDown.click();
		}
		
		public static void clickSave() {
			save.click();
		}
	}
	
	public static class MethodologyModal{
		
		private static Element modalTitle(String title) {
			return new Element(title,By.xpath("//app-create-edit-methodology//h4[contains(text(),'"+title+"')]"));
		}
		private static ListBox title = new ListBox("Title",By.xpath("//app-create-edit-methodology//select[@id='Title']"));
		private static Element verifytitle = new Element("Title",By.xpath("//app-create-edit-methodology//select[@id='Title']"));
		private static TextBox descriptionTextBox = new TextBox("Description",By.xpath("//app-create-edit-methodology//div[contains(@class,'ql-editor')]/p"));
		private static Button addMethod = new Button("Add method",By.xpath("//app-create-edit-methodology//a[contains(text(),'Add Method')]"));
		private static Button save = new Button("Save",By.xpath("//app-create-edit-methodology//button[@type='submit']"));
		private static Element researchMethodAlert(String method) {
	        	return new Element("Research method: "+method,By.xpath("//app-create-edit-methodology//div[contains(@class,'ac-alerts')]//div[contains(text(),'"+method+"')]"));
	        }
		public static void verifyTitleValueIsCorrect(String value) {
			verifytitle.verifyAttributeContains("value", value);
		}
		
		public static void verifyDescriptionValueIsCorrect(String value) {
			descriptionTextBox.verifyTextContains(value);
		}
		
		public static void verifyResearchMethodAlertIsDisplayed(String value) {
			researchMethodAlert(value).verifyDisplayed();
		}
		
		public static void clickSave() {
			save.click();
		}
		public static void verifyModalTitle(String title) {
			modalTitle(title).verifyDisplayed();
		}
		
		public static void enterTitle(String titlename) {
			title.selectByVisibleText(titlename);
		}
		
		public static void enterDescription(String description) {
			descriptionTextBox.setText(description);
		}
		
		public static void clickAddMethod() {
			addMethod.click();
		}
		
		public static class ResearchMethodModal{
			
			private static TextBox treefilter = new TextBox("Tree filter",By.xpath("//app-research-method-tree//input[contains(@class,'tree-filter')]"));
			private static Element treeItem(String item) {
				return new Element(item,By.xpath("//app-research-method-tree//div[@role='treeitem' and @aria-label='"+item+"']"));
			}
			private static Element ItemAdded(String item) {
				return new Element(item,By.xpath("//app-research-method-tree//div[@role='alert' and contains(text(),'"+item+"')]"));
			}
			private static Button add = new Button("Add",By.xpath("//app-research-method-tree//button[@type='submit']"));
			private static Element tree = new Element("Tree items",By.xpath("//ul[@role='tree']"));
			
			public static void enterTreeFilter(String filter) {
				if(tree.isDisplayed()) {
					treefilter.setText(filter);
				}
				
			}
			
			public static void clickTreeItem(String item) {
				treeItem(item).click();
			}
			
			public static void verifyItemIsAdded(String item) {
				ItemAdded(item).verifyDisplayed();
			}
			
			public static void clickAdd() {
				add.click();
			}
		
		}	
	}
	
	public static class PublicationModal{
		
		private static Element modalTitle(String title) {
			return new Element(title+" Publication modal",By.xpath("//app-create-edit-publication//h4[contains(text(),'"+title+"')]"));
		}
		private static TextBox titleTextbox = new TextBox("Title",By.xpath("//app-create-edit-publication//input[contains(@id,'Title')]"));
		private static Element pubType = new Element("Publication Type",By.xpath("//app-create-edit-publication//select[@id='PublicationType']"));
		private static ListBox publicationType = new ListBox("Publication Type",By.xpath("//app-create-edit-publication//select[@id='PublicationType']"));
		private static TextBox publisherTextBox = new TextBox("Publisher",By.xpath("//app-create-edit-publication//input[@id='Publisher']"));
		private static TextBox publicationDate = new TextBox("Publication date",By.xpath("//app-create-edit-publication//input[@id='PublicationDate']"));
		private static TextBox abstractTextBox = new TextBox("Abstract",By.xpath("//app-create-edit-publication//div[contains(@class,'ql-editor')]/p"));
		private static TextBox tagTextBox = new TextBox("Tag",By.xpath("//app-create-edit-publication//input[@id='PublicationTags']"));
		private static Element tagDropdown = new Element("Tag dropdown",By.xpath("//typeahead-container//span"));
		private static Button save = new Button("Save",By.xpath("//app-create-edit-publication//button[@type='submit']"));
        private static Element tagAlert(String tagname) {
        	return new Element("Tag: "+tagname,By.xpath("//app-create-edit-publication//div[contains(@class,'ac-alerts')]//div[contains(text(),'"+tagname+"')]"));
        }
        public static void verifyTitleValueIsCorrect(String value) {
        	titleTextbox.verifyAttributeContains("value", value);
        }
        public static void verifyTagIsDisplayed(String value) {
        	tagAlert(value).verifyDisplayed();
        }
        
		public static void verifyPublicationTypeValueIsCorrect(String value) {
			pubType.verifyTextContains(value);
		}
		
		public static void verifyPublisherValueIsCorrect(String value) {
			publisherTextBox.verifyAttributeContains("value", value);
		}
		public static void verifypublicationDateValueIsCorrect(String value) {
			publicationDate.verifyAttributeContains("value", value);
		}
		
		public static void verifyAbstractValueIsCorrect(String value) {
			abstractTextBox.verifyTextEquals(value);
		}
		
		
		public static void clickSave() {
			save.click();
		}
		
		public static void verifyModalTitleIsDisplayed(String title) {
			modalTitle(title).verifyDisplayed();
		}
		
		public static void enterTitle(String title) {
			titleTextbox.setText(title);
		}
		
		public static void selectPublicationType(String type) {
			publicationType.selectByVisibleText(type);
		}
		
		public static void enterPublisher(String publisher) {
			publisherTextBox.setText(publisher);
		}
		
		public static void enterPublicationDate(String date) {
			publicationDate.setValueWithJavascript(date);
		}
		
		public static void enterAbstract(String details) {
			abstractTextBox.setText(details);
		}
		
		public static void enterAndSelectTag(String tag) {
			tagTextBox.setText(tag);
			DriverHandler.delay(4);
			tagDropdown.click();
		}
		
		public static void enterTag(String tag) {
			tagTextBox.setText(tag);
		}
	}
	
	public static class confirmationModal{
		private static Element title(String message) {
			return new Element(message,By.xpath("//h2[@class='swal2-title' and text()='"+message+"']"));
		}
		private static Button yesBtn = new Button("Yes",By.xpath("//div[@class='swal2-actions']/button[text()='Yes']"));
		private static Button cancelBtn = new Button("Cancel",By.xpath("//div[@class='swal2-actions']/button[text()='Yes']"));
		
		public static void verifyMessageIsDisplayed(String message) {
			title(message).verifyDisplayed();
		}
		
		public static void clickYes() {
			yesBtn.click();	
		}
		
		public static void clickCancel() {
			cancelBtn.click();
		}
	}
}

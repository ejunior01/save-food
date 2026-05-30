# DespensaCerta

DespensaCerta is the household food-management context. It exists to name the concepts used to organize stored food, prevent expiry-related waste, plan shopping, and suggest ways to use available ingredients.

## Language

### Household Food

**User**:
A person who uses DespensaCerta to manage food in their household. One **User** owns many **Food Items**, **Shopping Items**, and **Storage Locations**.
_Avoid_: account owner, client

**Household**:
The domestic context managed by a **User**, including stored food, shopping planning, and consumption decisions.
_Avoid_: home account, family account

**Inventory**:
The current set of active **Food Items** owned by a **User**. It excludes food already marked as consumed or discarded.
_Avoid_: stock, catalog, pantry

**Barcode Product**:
External product information found from a barcode lookup before it becomes a **Food Item** in the user's **Inventory**.
_Avoid_: scanned item, API product

**Recognized Food Candidate**:
A fresh fruit or vegetable visually identified from a photo before the **User** confirms it as a **Food Item**.
_Avoid_: detected item, AI product, alimento cadastrado

**Recognized Food Quantity**:
The estimated amount of a **Recognized Food Candidate**, grouped by food type rather than by each visible unit.
_Avoid_: detection count, separate detections

**Food Item**:
A specific food product the **User** has stored, including its quantity, category, expiry date, and storage location.
_Avoid_: product, pantry item, alimento cadastrado

**Food Quantity**:
The amount of a **Food Item**, expressed as a number and a unit.
_Avoid_: stock count, amount field

**Expiry Date**:
The date after which a **Food Item** should no longer be considered within its intended consumption period.
_Avoid_: due date, deadline

**Alert Offset**:
The number of days before an **Expiry Date** when an **Expiry Alert** should be sent or shown.
_Avoid_: reminder delay, notification threshold

**Expiry Alert**:
A preventive reminder tied to a **Food Item** and its **Expiry Date**. It exists to prompt action before waste happens.
_Avoid_: notification, warning, alarm

**Expiry Status**:
The current urgency classification of a **Food Item** based on its **Expiry Date**.
_Avoid_: state, label

**Storage Location**:
A named place where **Food Items** are kept, such as pantry, refrigerator, or freezer. One **Storage Location** contains many **Food Items**.
_Avoid_: environment, place, local

**Food Category**:
A classification used to group **Food Items** by type, such as dairy, fruit, vegetables, grains, or proteins.
_Avoid_: tag, department

**Consumption Outcome**:
The final result of a **Food Item** leaving the **Inventory**, either because it was consumed or discarded.
_Avoid_: deletion, removal

**Consumed Food**:
A **Food Item** that left the **Inventory** because the **User** used it before or at the moment of decision.
_Avoid_: used item, completed food

**Discarded Food**:
A **Food Item** that left the **Inventory** because the **User** decided it should not be consumed.
_Avoid_: deleted item, wasted item

**Food Waste**:
The negative outcome represented by **Discarded Food**, especially when the discard is related to expiry or loss of control.
_Avoid_: trash, loss

**Savings Estimate**:
An approximate financial value associated with avoiding duplicate purchases or consuming food before it becomes **Food Waste**.
_Avoid_: profit, revenue

### Planning

**Shopping Item**:
An item the **User** intends to buy, with quantity, unit, category, and completion status.
_Avoid_: purchase, list entry

**Shopping List**:
The collection of **Shopping Items** used by the **User** to plan replenishment and avoid duplicate purchases.
_Avoid_: cart, market list

**Duplicate Purchase**:
A purchase-planning risk where a **Shopping Item** overlaps with an active **Food Item** already present in the **Inventory**.
_Avoid_: repeated item, duplicate product

**Replenishment**:
The act of planning to buy an item because the household needs or will soon need more of it.
_Avoid_: restock, replacement

**Recipe Suggestion**:
A preparation idea shown to the **User** based on available or soon-to-expire **Food Items**.
_Avoid_: recipe, recommendation

**Recipe Ingredient**:
A food component required by a **Recipe Suggestion**. It may match an active **Food Item** or become a missing ingredient.
_Avoid_: recipe item

**Missing Ingredient**:
A **Recipe Ingredient** that is not matched to an active **Food Item** in the **Inventory**.
_Avoid_: unavailable item, needed product

**Use-First Food**:
A **Food Item** that should be prioritized because its **Expiry Date** is close.
_Avoid_: urgent product, priority item

### Business Model

**Free Plan**:
The access level intended to validate the core value of food control and essential expiry support.
_Avoid_: basic account

**Premium Plan**:
The paid access level intended for personalization, reports, and more complete household-management features.
_Avoid_: paid account, pro plan

## Flagged Ambiguities

**Product vs Food Item**:
The source documents use "produto" and "alimento" interchangeably. Use **Food Item** for something stored by a user, and reserve "product" only for external barcode lookup data before it is added to the user's household.

**Recognized Food Candidate vs Food Item**:
A visual recognition result is only a **Recognized Food Candidate** until the **User** confirms the quantity, expiry date, category, and storage location.

**Recognition Grouping**:
Multiple visible units of the same fruit or vegetable should become one **Recognized Food Candidate** with a **Recognized Food Quantity**, not separate candidates.

**Environment vs Storage Location**:
The PDF uses "ambiente" and the application uses "locais de armazenamento". Use **Storage Location** as the canonical term.

**Notification vs Expiry Alert**:
The PDF describes a notification service, while the app currently shows in-app urgency labels. Use **Expiry Alert** for the domain concept, regardless of whether it is delivered in-app or as a push notification.

**Recipe vs Recipe Suggestion**:
The business value is not a generic recipe book. Use **Recipe Suggestion** when the recipe is selected because it helps use available or expiring food.

**Delete vs Consumption Outcome**:
Removing a **Food Item** from the interface is not enough domain language. Use **Consumed Food** or **Discarded Food** when the action matters for savings, waste, or reports.

**Pantry vs Inventory**:
"Pantry" is a storage place in common speech, but the app often uses it to mean all stored food. Use **Inventory** for the full active collection and **Storage Location** for a specific place.

## Example Dialogue

Developer: "When a user scans a barcode, do we create a Food Item immediately?"

Domain expert: "Only after the user confirms quantity, expiry date, and storage location. Until then it is just product data from barcode lookup."

Developer: "When the app recognizes bananas, grapes, or tomatoes in a photo, are they Food Items immediately?"

Domain expert: "No. They are Recognized Food Candidates until the user confirms the final Food Item fields."

Developer: "If the photo has a bunch of bananas or several tomatoes, should each unit become a separate candidate?"

Domain expert: "No. Group by food type and estimate one Recognized Food Quantity for that candidate."

Developer: "Should an expired Food Item stay visible?"

Domain expert: "Yes. It should keep an Expiry Status that makes it urgent, and the user decides whether it was used or discarded."

Developer: "Can a Recipe Suggestion include ingredients the user does not have?"

Domain expert: "Yes, but the reason it appears should be available or soon-to-expire Food Items. Missing ingredients can become Shopping Items later."

Developer: "Should pressing discard just delete the Food Item?"

Domain expert: "No. It can disappear from the Inventory, but the outcome should be Discarded Food so the app can measure Food Waste."

Developer: "When should the app warn about a Duplicate Purchase?"

Domain expert: "When a Shopping Item matches a Food Item still active in the Inventory, especially if the quantity is enough for the household."

# Checklist

<!-- Make sure you fill out this checklist with what you've done before submitting! -->

- [Done] Read the README [please please please]
- [Done] Something cool!
- [Done] Back-end
  - [Done] Minimum Requirements
    - [Done] Setup MongoDB database
    - [Done] Setup item requests collection
    - [Done] `PUT /api/request`
    - [Done] `GET /api/request?page=_`
  - [Done] Main Requirements
    - [Done] `GET /api/request?status=pending`
    - [Done] `PATCH /api/request`
  - [Done] Above and Beyond
    - [Done] Batch edits
    - [Done] Batch deletes
- [Done] Front-end
  - [Done] Minimum Requirements
    - [Done] Dropdown component
    - [Done] Table component
    - [Done] Base page [table with data]
    - [Done] Table dropdown interactivity
  - [Done] Main Requirements
    - [Done] Pagination
    - [Done] Tabs
  - [Done] Above and Beyond
    - [Done] Batch edits
    - [Done] Batch deletes

# Notes

<!-- Notes go here -->

For the fontend I follow most of the display on the Figma. However, I did change a bit style of the dropdown status. For me, if user wants to ajust there status on just a row when they click on the chervonDown, I set everything status to white bg and only show the corresponding status when they hover it. I also think that some user like to adjust that only row directly, and sometimes they may not like to scroll all the way up to change the Status on the top right. So, I decided to keep the chevendown there for them to choose their status. While the Figma, it shows that user should select that row then click on Status button - no chevendown option for each row (I make both so user can either choose the one they like - adjust directly only 1 row, or multiple selection)

I copy the data.ts that you have create for the task in /admin/mock/data.ts as the json for my data.ts which is located in src/components/lib/data.ts.

If you want to reset the json to run the web again, you can go to "localhost:3000/api/seed" to reset the database, then go back to "localhost3000/api/admin"

Struggle:

- Sorry my commit is so messy. At first I just decided to do frontend so I did the front end part, but later I wanted to challenge myself so at that time I just started to do the backend
- I cannot debug the hover for checkbox so I decided to hover the whole row

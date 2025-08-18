# Checklist

<!-- Make sure you fill out this checklist with what you've done before submitting! -->

- [ ] Read the README [please please please]
- [ ] Something cool!
- [ ] Back-end
  - [ ] Minimum Requirements
    - [ ] Setup MongoDB database
    - [ ] Setup item requests collection
    - [ ] `PUT /api/request`
    - [ ] `GET /api/request?page=_`
  - [ ] Main Requirements
    - [ ] `GET /api/request?status=pending`
    - [ ] `PATCH /api/request`
  - [ ] Above and Beyond
    - [ ] Batch edits
    - [ ] Batch deletes
- [ ] Front-end
  - [ ] Minimum Requirements
    - [ ] Dropdown component
    - [ ] Table component
    - [ ] Base page [table with data]
    - [ ] Table dropdown interactivity
  - [ ] Main Requirements
    - [ ] Pagination
    - [ ] Tabs
  - [ ] Above and Beyond
    - [ ] Batch edits
    - [ ] Batch deletes

# Notes

<!-- Notes go here -->

For the fontend I follow most of the display on the Figma. However, I did change a bit style of the dropdown status. For me, if user wants to ajust there status on just a row when they click on the chervonDown, I set everything status to white bg and only show the corresponding status when they hover it. I also think that some user like to adjust that only row directly, and sometimes they may not like to scroll all the way up to change the Status on the top right. So, I decided to keep the chevendown there for them to choose their status. While the Figma, it shows that user should select that row then click on Status button - no chevendown option for each row (I make both so user can either choose the one they like - adjust directly only 1 row, or multiple selection)

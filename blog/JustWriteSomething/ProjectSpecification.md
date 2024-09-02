1. Uniform code formatting rules, otherwise git history will be very messy
2. Git branches and tag naming rules
3. The front-end route determines the url rules, where to use / [id] and which to use /? id= {id}
4. Is there a need for seo, and is there a need for both H5/Mini programs/App or just one of them
5. Css naming convention
6. Determine the domain, path and whether httponly is required for cookie
7. Do not use a version number like / v1 for baseUrl, and the docker parameter is the same.
8. Direct use of new Date or moment ()-like methods that depend on the client environment in the project is prohibited.
9. The intranet ip of each member of the team is set to static and written to the document.
10. More than 15-bit (or ±2mm / 53) number is converted to string and then returned to the front end.
11. Cdn picture naming rules
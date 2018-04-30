Objects involved:
- PageContainer
  - Page
    - UriPage
    - MvcPage
  - NavigationContainer
  - Navigation

## Overall data structures
- PageContainer - Doubly linked list like
    - Doubly linked list properties
        - pages (right)
        - parent (left)
    - pages property should yield pages only when called.
    - pages will be kept as a Set internally and yielded as 
    an array when requested.


Rules:
- Navigation creates page objects.
- PageContainer has CRUD operations for pages.


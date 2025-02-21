Form table
---
> table > tbody > tr > td structure
### Table area
1. Header thead
two。 Form body tbody
3. Footer tfoot
### Table grid
1. Line tr
two。 Column th (bold), td
### Common attribut
1. Align: left | center | right
> ecifies how tables contained in the document must be aligned
2. Bgcolor
> fines the background color of the table
3. Border
> fines the size of the table border
4. Cellpadding
> fines the space between the contents of the table cell and the border (padding)
5. Cellspacing
> fines the size of space between two cells (margin)
6. frame(Obsolete): above|  below | hsides | vsides | lhs | rhs | border | box | void
> fines which edge of the frame surrounding the table must be displayed
```html
<table>
  <thead>
    <tr>
      <th>名称</th>
      <th>价格</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>妖梦</td>
      <td>233$</td>
    </tr>
    <tr>
      <td>Sep</td>
      <td>233$</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>共计</td>
      <td>466$</td>
    </tr>
  </tfoot>
</table>
```
> Usually tables must have the style border-collapse: collapse, which overlaps cell borders.
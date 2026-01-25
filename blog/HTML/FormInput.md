Web-based forms create interactive controls to accept data from users; various types of input data and control widgets can be used, depending on the device and user agent.
### Application scenario
Button, check box, color picker, Sunday time selector, mailbox format input, file upload, number input, password input, radio button, range value slide selector, reset button, search box, submit button,
```html
<input type="text" />
```
### Control type type
1. Button: no default behavior button.
2. Checkbox: check box.
> u must use the value property to define the value when this control is submitted.
> Use the checked property to indicate whether the control is selected. You can also use indeterminate to indicate that the check box is in an indeterminate state (on most platforms, it appears as a horizontal line through the check box).
3. A control used by color:HTML5 to specify a color.
4. Date:HTML5 controls for entering dates (year, month, day, excluding time).
5. Datetime-local:HTML5 is used to enter a date-time control without a time zone.
6. Email: HTML5 field for editing e-mail.
> Use:valid and:invalid CSS pseudo-classes when appropriate.
7. File: this control allows users to select files.
> e the accept property to define the file types that the control can select.
8. Hidden: a control that does not appear on the page, but its value is submitted to the server.
9. Image: Picture submission button.
> you must use the src attribute to define the source of the picture and use alt to define alternative text.
> you can also use the height and width properties to define the size of a picture in pixels.
10. Month:HTML5 is used to enter controls for years and months, without time zone.
11. Number: a control used by HTML5 to enter floating point numbers.
12. Password: a single-line text field whose value is masked.
> e maxlength to specify the maximum length of values that can be entered.
13. Radio: radio button.
> The value attribute must be used to define the value of this control when it is submitted.
> ing checked must indicate whether the control is selected by default.
> In the same radio button group, the name attribute of all radio buttons uses the same value; in a radio button group, only one radio button can be selected at a time.
14. Range:HTML5 is used to enter imprecise value controls.
If the appropriate property is not specified, the control uses the following default values:
Min:0
Max:100
Value:min + (max-min) / 2, or use min when max is less than min
Step:1
15. Reset: the button used to set the contents of the form to the default.
16. The single-line text field used by search:HTML5 to enter the search string.
> Line breaks are automatically removed from the entered values.
17. Submit: the button for submitting the form.
18. Controls used by tel:HTML5 to enter phone numbers
> ne wrapping automatically removes A from the entered value, but no other syntax is performed.
> u can use properties such as pattern and maxlength to constrain the values entered by the control.
> When appropriate, apply:valid and:invalid CSS pseudo-classes.
19. text: single-line field;
> e line wrap is automatically removed from the entered value.
20. Time:HTML5 is used to enter a time control without a time zone.
21. Url:HTML5 is used to edit the fields of URL.
> users can enter blank or invalid addresses. Line breaks are automatically moved from the input values.
> you can use attributes such as: pattern and maxlength to constrain the input value.
> ke it possible to apply: valid and: invalid CSS pseudo classes when appropriate.
twenty-two。 Week:HTML5 is used to enter a date consisting of a week-year, excluding time.
### Common attribut
Autocomplete: auto fill
Autofocus: when the form is rendered on a web page, the focus automatically falls on this element
Disabled: disablin
List: points to a datalist element whose id is the value of the list attribute, providing a recommended value for this input element
Name
Readonly: cannot be edited
Required: the entire form can be submitted only if this input element has a value
Tabindex: a number equivalent to a serial number. When the user presses the keyboard Tab key, the focus falls on the corresponding element from small to large according to the serial number.
> en this value is-1, it means that the focus will never fall on this element through the Tab key
Value: current valu
Accept: MIME type
## fsSelect

fsSelect is a jQuery plugin to select multiple elements with checkboxes. Support
selectAll, decelectAll, showSelected fuctions. You can add your own functions on
events and get related data.

## Usage

In Html: 1.include bootstrap 2.include js and css files.

Add the following sentences to your html file:

```
<script type="text/javascript" src="fs-plugin/fsSelect.js"></script>
<link rel="stylesheet" href="fs-plugin/fsSelect.css">
```

In javascript: Create your select with the .fsSelect() function

```
$('.your-select-box').fsSelect();
```

**Available options**

Init options:

```
$('.your-select-box').fSelect({
    placeholder: 'Select some options',
    data: []
});
```

placeholder: (string) - the default placeholder text.
data: ([string]) - the options.

**Available events**

click on options

```
$('.your-select-box').fsSelect('clickOnOptionBind','yourClickOnOptionFunction');
```

choose options (tick the checkbox)

```
$('.your-select-box').fsSelect('chooseOptionBind','yourChooseOptionFunction');
```

mouse over option

```
$('.your-select-box').fsSelect('mouseOverOptionBind','yourMouseOverOptionBindFunction');
```

mouse out fuction

```
$('.your-select-box').fsSelect('mouseOutOptionBind','yourMouseOutOptionFunction');
```

select all optionn

```
$('.your-select-box').fsSelect('selectAllBind','yourSelectAllFunction');
```

delete all options

```
$('.your-select-box').fsSelect('deSelectAllBind','yourDeSelectAllFunction');
```

show selected options

```
$('.your-select-box').fsSelect('showSelectedBind','yourShowSelectedFunction');
```

**Get/Set data**

get number of options
return {number}

```
$('.your-select-box').fsSelect('getOptionNum');
```

get the index of selected option
Selected means clik on option while the checkbox will not be not checked.
Only one can be selected.
return {number}
if no option is selected, return -1.

```
$('.your-select-box').fsSelect('getSelectedOptionIndex');
```

get chosen option indexes
Chosen means the checkbox of the option is checked.
Chosen does not have direct connection with Selected. When one option is
selected, it will not be chosen and vice versa.
return {[number]}

```
$('.your-select-box').fsSelect('getChosenOptionIndexes');
```

get mouse over indexes
return {number}
If mouse is out of options, return -1.

```
$('.your-select-box').fsSelect('getMouseIndex');
```

set chosen option indexes
param {[numbe]}

```
$('.your-select-box').fsSelect('setChosenOptionIndexes');
```

set selected option index
param {number}
return {number}

```
$('.your-select-box').fsSelect('setSelectedOptionIndex');
```

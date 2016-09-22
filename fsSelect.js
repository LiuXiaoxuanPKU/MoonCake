(function($) {

  var Methods = {
    init: function(options) {
      return this.each(function() {
        Methods.iniElements(this);
        Methods.addEvents(this);
      });
    },

    iniElements: function(select) {
      this.$select = $(select);

      var searchGroup = $('<div></div>').addClass('input-group fs-search');

      var searchInput = $('<input>')
                            .attr('type', 'text')
                            .attr('placeholder', Data.placeholder)
                            .addClass('form-control');

      var selectFunctionButton =
          $('<button></button>')
              .attr('type', 'button')
              .attr('data-toggle', 'dropdown')
              .attr('aria-haspopup', 'true')
              .attr('aria-expanded', 'false')
              .addClass('btn btn-default')
              .append('<span class="glyphicon glyphicon-plus"></span>');

      var selectAll =
          $('<li></li>').addClass('fs-selectAll').text('Select All');
      var deSelectAll =
          $('<li></li>').addClass('fs-deSelectAll').text('DeSelect All');
      var showSelected =
          $('<li></li>').addClass('fs-showSelected').text('Show Selected');

      var functionMenu = $('<ul></ul>')
                             .addClass('dropdown-menu dropdown-menu-right')
                             .append(selectAll, deSelectAll, showSelected);

      var resourceMenuButton = $('<button></button>')
                                   .addClass('fs-resourceMenuButton')
                                   .addClass('btn btn-default')
                                   .append('<span class="caret"></span>');

      var inputGroup =
          $('<div></div>')
              .addClass('input-group-btn')
              .append(selectFunctionButton, functionMenu, resourceMenuButton);

      var search = searchGroup.append(searchInput, inputGroup);

      // The whole plugin is with in the <div class=fs-wrap/>
      this.$select.wrap('<div class=fs-wrap/>');

      // Hide select created by users
      this.$select.addClass('hidden');

      this.$wrap = this.$select.parent('.fs-wrap');

      this.$wrap.prepend(search);

      this.$select.before('<div class="fs-dropdown hidden"></div>');

      // Build options
      Methods.buildOptions($('.fs-dropdown'));
    },

    buildOptions: function($parent) {
      for (var index = 0; index < Data.optionNum; index++) {
        var val = Data.optionValues[index];
        var text = Methods.shortenOptionText(val);
        var choice = $('<div></div>')
                         .addClass('fs-option')
                         .attr('value', val)
                         .attr('data-index', index);

        var optionLabel = $('<div></div>')
                              .addClass('fs-option-label')
                              .append('<input type=checkbox />')
                              .append('<span></span>')
                              .find('span')
                              .addClass('fs-url')
                              .text(text)
                              .end();
        choice.append(optionLabel);
        $parent.append(choice);
      }
    },

    addEvents: function() {
      $('.input-group.fs-search').on('click', Methods.clickOnSearch);
      $('.fs-option').on('click', Methods.clickOnOption);
      $('.fs-option-label input').on('click', Methods.chosenOption);
      $('.fs-search input').on('keyup', Methods.optionSearch);
      $(document).on('click', '*', Methods.checkCloseDropdown);
      $('.fs-resourceMenuButton')
          .on('click', Methods.clickOnResourceMenuButton);
      $('.fs-selectAll').on('click', Methods.selectAllResource);
      $('.fs-deSelectAll').on('click', Methods.deSelectAllResource);
      $('.fs-showSelected').on('click', Methods.showSelectedResource);
    },
    /**
     * Basic results of behavior on options
     *
     */
    clickOnOption: function(e) {
      if ($(e.target).attr('type') != 'checkbox') {
        var $option = $(e.target).closest('.fs-option');
        if ($option.hasClass('clicked')) {
          $option.removeClass('clicked');
          Data.selectedOptionIndex = -1;
        } else {
          if (Data.selectedOptionIndex != -1)
            $($('.fs-option')[Data.selectedOptionIndex]).removeClass('clicked');
          $option.addClass('clicked');
          Data.selectedOptionIndex = parseInt($option.attr('data-index'));
        }
        viewTask.optionClicked(this);
      }
    },

    clickOnSearch: function(e) {
      if (!$(e.target).hasClass('resourceMenuButton')) Methods.openDropdown();
    },

    clickOnResourceMenuButton: function() {
      var $fsDropdown = $('.fs-dropdown');
      if ($fsDropdown.hasClass('hidden'))
        Methods.openDropdown();
      else {
        console.log('test');
        Methods.closeDropdown();
      }
      this.blur();
    },

    chosenOption: function(e) {
      var $option = $(e.target).closest('.fs-option');
      if ($option.hasClass('selected'))
        $option.removeClass('selected');
      else
        $option.addClass('selected');
      Methods.updateChosenOption();
    },

    optionSearch: function() {
      var $wrap = $('.fs-wrap');
      var matchOperators = /[|\\{}()[\]^$+*?.]/g;
      var keywords = $(this).val().replace(matchOperators, '\\$&');

      $wrap.find('.fs-option').removeClass('hidden');
      if ('' != keywords) {
        $wrap.find('.fs-option').each(function() {
          var regex = new RegExp(keywords, 'gi');
          if (null === $(this).attr('value').match(regex)) {
            $(this).addClass('hidden');
          }
        });
      }
    },

    checkCloseDropdown: function(e) {
      var classStr = $(e.target).closest('.fs-wrap');
      if (!classStr.hasClass('fs-wrap')) Methods.closeDropdown();
    },

    /**
     * Utility functions
     */

    /**
     * Shorten options to make options' text shorter than dropdown menu
     *
     * @param {string} text - SourceText
     * @return {!string}
     */
    shortenOptionText: function(text) {
      //delete the 'http://' or 'https://'
      var newtext = text.split('//')[1];
      var length = newtext.length;
      var numberOfWordsInOpt = length / ( 370 / 50 ); 
      if (length > numberOfWordsInOpt){
        var index = 2 / 5 * numberOfWordInOpt;
        return newtext.slice( 0, index ) + '...' + newtext.slice(length - index, length);
      }
      return newtext;
    },

    openDropdown: function($wrap) {
      $('.fs-dropdown').removeClass('hidden');
    },

    closeDropdown: function($wrap) {
      $('.fs-dropdown').addClass('hidden');
    },

    selectAllResource: function() {
      $('.fs-option:not(.hidden)').addClass('selected');
      $('.fs-option:not(.hidden)').each(function() {
        $(this).find('input').get(0).checked = true;
        Data.chosenOptionIndexes.push(
            parseInt($(this).closest('.fs-option').attr('data-index')));
      });
      Methods.updateChosenOption();
      viewTask.optionClicked(this);
    },

    deSelectAllResource: function() {
      $('.fs-option.selected:not(.hidden)').each(function() {
        $(this).find('input').get(0).checked = false;
      });
      $('.fs-option:not(.hidden)').removeClass('selected');
      Methods.updateChosenOption();
      viewTask.optionClicked(this);
    },

    showSelectedResource: function() {
      if ($(this).hasClass('clicked')) {
        $('.fs-option').removeClass('hidden');
        $('.fs-showSelected').removeClass('clicked');
      } else {
        $('.fs-option:not(.selected)').addClass('hidden');
        $('.fs-showSelected').addClass('clicked');
      }
      viewTask.optionClicked(this);
    },

    updateChosenOption: function() {
      Data.chosenOptionIndexes = [];
      $('.fs-option.selected').each(function() {
        Data.chosenOptionIndexes.push(parseInt($(this).attr('data-index')));
      });
    },

    // API

    /**
     * Bind events
     */
    /**
     *
     * @param {!object} clickFunction
     * @return {this}
     */
    clickOnOptionBind: function(clickFunction) {
      var newClickFunction = function(e) {
        if ($(e.target).attr('type') != 'checkbox') clickFunction();
      };
      $('.fs-option').on('click', newClickFunction);
      return this;
    },
    /**
     *
     * @param {!object} chosenFunction
     * @return {this}
     */
    chooseOptionBind: function(chosenFunction) {
      $('.fs-option-label input').on('click', chosenFunction);
      return this;
    },
    /**
     *
     * @param {!object} mouseOverFunction
     * @return {this}
     */
    mouseOverOptionBind: function(mouseOverFunction) {
      $('.fs-option').on('mouseover', mouseOverFunction);
      return this;
    },
    /**
     *
     * @param {!object} mouseOverFunction
     * @return {this}
     */
    mouseOutOptionBind: function(mouseOverFunction) {
      $('.fs-option').on('mouseout', mouseOverFunction);
      return this;
    },
    /**
     *
     * @param {!object} selectAllFunction
     * @return {this}
     */
    selectAllBind: function(selectAllFunction) {
      $('.fs-selectAll').on('click', selectAllFunction);
      return this;
    },
    /**
     *
     * @param {!object} deSelectAllFunction
     * @return {this}
     */
    deSelectAllBind: function(deSelectAllFunction) {
      $('.fs-deSelectAll').on('click', deSelectAllFunction);
      return this;
    },
    /**
     *
     * @param {!object} showSelectedFunction
     * @return {this}
     */
    showSelectedBind: function(showSelectedFunction) {
      $('.fs-showSelected').on('click', showSelectedFunction);
      return this;
    },

    /**
     * Get data
     */
    getOptionNum: function() {
      return Data.optionNum;
    },

    getSelectedOptionIndex: function() {
      return Data.selectedOptionIndex;
    },

    getChosenOptionIndexes: function() {
      return Data.chosenOptionIndexes;
    },
    /**
     *
     * Get the index of mouse over option
     * If mouse is out of options, return -1
     *
     * @return {number} mouseoverIndex
     *
     */
    getMouseIndex: function() {
      $(document).mousemove(function(e) {
        Data.mouseoverIndex =
            $(e.target).closest('.fs-option').attr('data-index');
      });
      return Data.mouseoverIndex || -1;
    },

    /**
     * Set data
     */
    /**
     * set chosen option indexes
     *
     * @param {Array<number>} chosenOptionIndexes - The indexes of options
     */
    setChosenOptionIndexes: function(chosenOptionIndexes) {
      Data.chosenOptionIndexes = chosenOptionIndexes;
      $('.fs-option').each(function() {
        var index = parseInt($(this).attr('data-index'));
        if (Data.chosenOptionIndexes.findIndex(function(i) {
              return i === index;
            }) != -1)
          $(this).find('input').get(0).checked = true;
        else
          $(this).find('input').get(0).checked = false;
      });
    },
    /**
     * set chosen option indexes
     *
     * @param {Array<number>} selectedOptionIndex - The index of selected option
     * @return {number} selectedOptionIndex
     */
    setSelectedOptionIndex: function(selectedOptionIndex) {
      $($('.fs-option')[Data.selectedOptionIndex]).removeClass('clicked');
      Data.selectedOptionIndex = selectedOptionIndex;
      if (Data.selectedOptionIndex != -1)
        $('.fs-option')[Data.selectedOptionIndex].addClass('clicked');
      viewTask.optionClicked($('.fs-dropdown'));
      viewTask.optionClicked($('.dropdown-menu'));
      return Data.selectedOptionIndex;
    },
  };

  var Data = {
    /**
     * Number of options
     * @private {number}
     */
    optionNum: 0,
    /**
     * Values of each option
     * @private {Array<string>}
     */
    optionValues: [],
    /**
     * @private {string}
     */
    placeholder: '',
    /**
     * Number of options
     * @private {number}
     */
    mouseoverIndex: -1,
    /**
     * Selected option index. Selected means clik on option while the checkbox
     * is not checked.
     * Only one can be selected.
     * @private {number}
     */
    selectedOptionIndex: -1,
    /**
     * Chosen option index. Chosen means the checkbox of the option is checked.
     * Chosen does not have direct connection with Selected. When one option is
     * selected, it will not be chosen and vice versa.
     * Many options can be chosen.
     * @private {Array<number>}
     */
    chosenOptionIndexes: []
  };

  var viewTask = {
    optionClicked: function(element) {
      $element = $(element);
      var $dropDown = $element.closest('*[class*=\'dropdown\']');
      $dropDown.children().css('background-color', '#fff');
      $dropDown.children('.clicked').css('background-color', '#e1e1ea');
    }
  };

  $.fn.fsSelect = function(methodOrData) {
    // Create some defaults, extending them with any options that were provid
    var defaults = {'placeholder': 'Resource filter', 'data': []};

    // Use an empty object as the first argument to protect the default val
    var settings = $.extend({}, defaults, methodOrData);
    Data.optionNum = settings.data.length;
    Data.optionValues = settings.data;
    Data.placeholder = settings.placeholder;

    if (Methods[methodOrData])
      return Methods[methodOrData].apply(
          this, Array.prototype.slice.call(arguments, 1));
    else if (typeof methodOrData === 'object' || !methodOrData)
      return Methods.init.apply(this, arguments);
    else
      $.error('Method ' + methodOrData + ' does not exist on jQuery.fsSelect');
  };
})(jQuery);

// ex : https://pl.wiktionary.org/wiki/odora%C4%89i

var termsStorage = {},
    reInnerCapture = /^\((.+)\)$/,
    reSplit = / *, +/,
    reMain = /(\d+(?:[-–,\d]+)?)/,
    reFull = new RegExp(mw.format('^$1(?:\\.$1)?$', reMain.source)),
    reRange = /^(\d+)[-–](\d+)$/,
    reTermNum = /^\((\d+)\.(\d+)\)$/,
    reTrailingSemicolon = /[\s;]+$/,
    $contentNode = $(),
    popupCloseDelay = 150;

function parseTerms($entryPoint, localTerms) {
  var $currTerms, currTerm,
      $currHeader = $entryPoint,
      firstLevel = 1,
      secondLevel = 1;

  while (true) {
    $currHeader = $currHeader.next('p');
    $currTerms = $currHeader.next('dl');

    if (
        !$currHeader.length || !$currHeader.hasClass('fldt-znaczenia') ||
        !$currTerms.length
    ) {
      break;
    }

    currTerm = {
      header: $currHeader,
      terms: [],
      valid: true
    };

    $currTerms.children('dd').each(function (i, dd) {
      var $dd = $(dd),
          $num = $dd.find('.term-num').first(),
          matches = reTermNum.exec($num.text());

      if (
          !$num.length || matches === null ||
          Number(matches[1]) !== firstLevel ||
          Number(matches[2]) !== secondLevel
      ) {
        currTerm.valid = false;
        return false;
      }

      currTerm.terms.push($dd);
      secondLevel++;
    });

    localTerms.push(currTerm);
    firstLevel++;
    secondLevel = 1;
    $currHeader = $currTerms;
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
function flatMap(arr, callback, thisArg) {
  if ('flatMap' in Array.prototype) {
    return Array.prototype.flatMap.call(arr, callback, thisArg);
  }
  else {
    return arr.map(callback, thisArg).reduce(function (acc, val) {
      return acc.concat(val);
    }, []);
  }
}

function parseNum(text) {
  return text.replace(reInnerCapture, '$1').split(reSplit).map(function (val) {
    return (reFull.exec(val) || []).splice(1).filter(function (capture) {
      return capture !== undefined;
    }).map(function (group) {
      return flatMap(group.split(','), function (subgroup) {
        return Number(subgroup) || expandRange(subgroup) || 0;
      });
    });
  }).filter(function (el) {
    return el.length && el.every(function (ell) {
      return ell.length;
    });
  });
}

function expandRange(expr) {
  var first, last,
      m = reRange.exec(expr);

  if (m === null) {
    return null;
  }

  first = Number(m[1]);
  last = Number(m[2]);

  // https://stackoverflow.com/a/20066663
  return Array.apply(null, {length: last + 1}).map(Number.call, Number).slice(first);
}

function selectTermEls(nums, termsArr) {
  return nums[0].reduce(function ($obj, lvl) {
    var termObj = termsArr[lvl - 1];

    if (!termObj || !termObj.valid) {
      return $obj;
    }

    $obj = $obj.add(termObj.header);

    if (nums.length === 1) {
      termObj.terms.forEach(function (term) {
        $obj = $obj.add(term);
      });
    }
    else {
      nums[1].forEach(function (lvl2) {
        $obj = $obj.add(termObj.terms[lvl2 - 1]);
      });
    }

    return $obj;
  }, $());
}

function populateStorage(code) {
  var selFmt = 'dl:has(dt.lang-$1.fldt-znaczenia)',
      $entryPoint = $contentNode.find(mw.format(selFmt, code)),
      localTerms = [];

  if ($entryPoint.length) {
    parseTerms($entryPoint, localTerms);
  }

  if (localTerms.length) {
    termsStorage[code] = localTerms;
  }

  return localTerms;
}

function makeContent($terms) {
  var html = '',
      startDefinition = false;

  $terms.each(function (i, el) {
    var $el = $(el),
        isDefinition = $el.is('dd');

    if (!isDefinition) {
      if (html !== '' && !startDefinition) {
        html += '</dl>';
      }

      html += $el.get(0).outerHTML;
      startDefinition = true;
    }
    else {
      if (startDefinition) {
        html += '<dl>';
        startDefinition = false;
      }

      html += $el.get(0).outerHTML;
    }
  });

  return $('<div>').html(html)
      .find('.reference').remove().end() // przypisy
      .find('dd').contents().filter(function () {
        return this.nodeType === Node.TEXT_NODE;
      }).each(function () {
        var $this = $(this),
            $next = $this.next();

        // szablony 'wikipedia', 'Gloger' itp. oraz poprzedzający je średnik
        if ($next.is('.term-preview-ignore')) {
          $next.remove();
          $this.replaceWith(function () {
            return this.textContent.replace(reTrailingSemicolon, '');
          });
        }
      }).end().end().end();
}

function enablePreview($num, code) {
  var $terms, popup, timer,
      destroyPopup = function () {
        if (popup) {
          popup.$element.remove();
        }

        popup = null;
      };

  if (!(code in termsStorage) && !populateStorage(code).length) {
    return;
  }

  $terms = parseNum($num.text()).reduce(function ($acc, nums) {
    return $acc.add(selectTermEls(nums, termsStorage[code]));
  }, $());

  if (!$terms.length) {
    return;
  }

  $num.on('click', function () {
    $('.term-selected').removeClass('term-selected');

    if (!mw.viewport.isElementInViewport($terms[0])) {
      $terms.first().get(0).scrollIntoView();
    }

    $terms.addClass('term-selected');

    $(document).one('click', function (e) {
      if (!$(e.target).closest($terms).length) {
        $terms.removeClass('term-selected');
      }
    });

    return false;
  }).on('mouseenter focus', function () {
    clearTimeout(timer);

    if (!popup) {
      mw.loader.using('oojs-ui-core').done(function () {
        popup = new OO.ui.PopupWidget({
          $content: makeContent($terms),
          $floatableContainer: $num,
          padded: true,
          align: 'forwards',
          classes: ['term-preview-container']
        });

        popup.$element.on('mouseenter focus', function () {
          clearTimeout(timer);
        }).on('mouseleave blur', function () {
          timer = setTimeout(destroyPopup, popupCloseDelay);
        }).appendTo($contentNode);

        popup.toggle(true);
      });
    }
  }).on('mouseleave blur', function (e) {
    timer = setTimeout(destroyPopup, popupCloseDelay);
  }).addClass('term-lookup');
}

if (
    mw.config.get('wgAction') === 'view' &&
    mw.config.get('wgNamespaceNumber') === 0
) {
  mw.hook('wikipage.content').add(function ($content) {
    var re = /lang-([a-z-]+)/;

    termsStorage = {};
    $contentNode = $content;

    $content.find('.term-num').filter(function () {
      var $defs = $(this).closest('.fldt-znaczenia');
      return !$defs.length || this !== this.parentElement.firstElementChild;
    }).each(function () {
      var $num = $(this),
          matches = $num.attr('class').match(re),
          code = matches && matches[1];

      if (code) {
        enablePreview($num, code);
      }
    });
  });
}

module.exports = {enablePreview: enablePreview};

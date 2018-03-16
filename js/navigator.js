/* 
 * Source file for LittleArcheologist page navigator.
 * Copyrighted 2014, Ratchanan Srirattanamet.
 * Part of Computer project subject of PSU.Wittayanusorn school.
 */

var Navigator = (function () {
    function Navigator(navigatingHook) {
        if (navigatingHook) {
            this.navigatingHook = navigatingHook;
        } else {
            this.navigatingHook = {
                navigateFrom : {},
                navigateTo : {}
            };
        }
        
        this.currentPage = null;
    }
    
    Navigator.prototype.addHook = function(type, page, func) {
        if ((type !== "navigateTo" && type !== "navigateFrom") || 
            !$('#'+page).length   || typeof func !== "function") {
            return false;
        }
        else {
            this.navigatingHook[type][page] = func;
            return true;
        }
    };
    
    Navigator.prototype.navigateTo = function (page) {
        var $page = $('#'+page);
        if (!$page.length) return false;
        
        var previousPage = this.currentPage;
        
        var prevPageFn, nextPageFn;
        
        if (this.navigatingHook.navigateFrom[previousPage]) {
            prevPageFn = this.navigatingHook.navigateFrom[previousPage];
        } else {
            prevPageFn = null;
        }
        
        if (this.navigatingHook.navigateTo[page]) {
            nextPageFn = this.navigatingHook.navigateTo[page];
        } else {
            nextPageFn = null;
        }
        
        var doNavigateIn = function(navigateCompleteFn) {
            $page.fadeIn(500, function() {
                if (typeof navigateCompleteFn === "function") {
                    navigateCompleteFn();
                }
            });
        };
        
        var doNavigateAway = function(navigateCompleteFn) {
            $('.page').fadeOut(500).promise().done(function() {
                if (typeof navigateCompleteFn === "function") {
                    navigateCompleteFn();
                }
                
                if (typeof nextPageFn === "function") {
                    nextPageFn(previousPage, doNavigateIn);
                }
                else {
                    doNavigateIn();
                }
            });
        };
        
        if (typeof prevPageFn === "function") {
            prevPageFn(page, doNavigateAway);
        }
        else {
            doNavigateAway();
        }
        
        this.currentPage = page;
        return true;
    };

    return Navigator;
})();
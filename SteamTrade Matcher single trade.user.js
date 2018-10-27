// ==UserScript==
// @name         SteamTrade Matcher single trade
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Searinox
// @icon         https://avatars0.githubusercontent.com/u/16297928?s=460&v=4
// @match        https://www.steamtradematcher.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js
// @grant        none
// ==/UserScript==

(function() {
    //'use strict';
    function getMatches() {
        top.matches = _.zip(jQuery('#match-results > div > div.panel-body > a').toArray(),
                            jQuery('#match-results > div > div.panel-heading.match-box > h1 > span.stm-user').toArray())
            .map(e => _.zipObject(['href', 'isBot'], [e[0].href.split('/'), e[1].textContent.includes('Trade bot')]))
            .map(e => _.zipObject(['sid', 'tradeToken', 'trade', 'isBot'], [e.href[5], e.href[6], _.zip(e.href[7].split(';'), e.href[8].split(';')).map(ee => _.zipObject(['them', 'you'], [ee[0], ee[1]])), e.isBot]))
        console.log(top.matches)
        top.matchesObj = {};
        top.matches.map(e => {
            e.trade.map(ee => {
                top.matchesObj[ee.you] = [...top.matchesObj[ee.you] || [], e];
            })
        });
        console.debug(top.matchesObj)
        top.matchesQuene = _.map(top.matchesObj, (val, key) => [key, _.sortBy(val, 'isBot').reverse()])
            .sort((a, b) => a[1].length - b[1].length)
            .map(e => {
            return e[1].map(ee => {
                ee.tradeSel = _.find(ee.trade, {you: e[0]});
                ee.tradeHref = `${location.origin}/action/startTradeOffer/${ee.sid}/${ee.tradeToken}/${ee.tradeSel.them}/${ee.tradeSel.you}`;
                return ee;
            });
        })
    }
    function fetchNextMatch() {
        top.matchesQuene.shift().map(ee => {
            console.log(ee.tradeHref);
            //window.open(ee.tradeHref);
        });
    }
    function savePublicProfiles() {
        localStorage.setItem('publicProfiles', JSON.stringify(
            [...(JSON.parse(localStorage.getItem('publicProfiles')) || []), ...publicProfiles]));
    }
    var compareInventories = function(steamid, source) {
        console.log('compareInventories');
        var cache = "true";
        if (source == "quickmatch") {
            cache = "false";
        }
        $.ajax({
            url: 'ajax/mcompare/' + steamid + '/' + cache,
            type: 'get',
            success: function(data) {
                $.each(data.results, function(steamID, userResults) {
                    localStorage.setItem(steamID, JSON.stringify(userResults));
                    progressCurrent++;
                    if (!userResults.error) {
                        var icon = "";
                        var desc = "";
                        var source_label = "";
                        var url_trade_token = "null";
                        if (userResults.info.items_count > 0) {
                            progressFound++;
                            if (userResults.info.source.friend == 'live') {
                                icon = 'icon-live.png';
                                desc = 'Source : live';
                            } else {
                                icon = 'icon-cache.png';
                                desc = 'Source : cache (updated : ' + userResults.info.last_update.friend + ')';
                            }
                            if (source == "public" || source == "quickmatch") {
                                if (userResults.info.player_info.friend.is_bot == 1) {
                                    source_label = ' <span class="stm-user">(Trade bot)</span>';
                                } else {
                                    if (source == "public") {
                                        source_label = ' <span class="stm-user">(STM user)</span>';
                                    }
                                }
                                url_trade_token = userResults.info.player_info.friend.trade_token;
                            }

                            var append = '';
                            var donator = '';
                            if (userResults.info.player_info.friend.donator_amount >= 10) {
                                donator = ' donator';
                            }
                            append += '<div class="panel panel-default match-box' + donator + '">';
                            append += '		<div class="panel-heading match-box">';
                            append += '			<div class="source-icon"><img src="res/img/' + icon + '" title="' + desc + '" /></div>';

                            append += '			<span class="report-user pull-right glyphicon glyphicon-ban-circle" data-steamid="' + userResults.info.player_info.friend.steamid + '" data-source="' + source + '" title="Add to Ignore List"></span>';

                            if (userResults.info.player_info.friend.has_escrow == "1") {
                                append += '			<span class="escrow-trade pull-right glyphicon glyphicon-warning-sign" title="This trade will be held by Steam"></span>';
                            }

                            if (userResults.info.player_info.friend.giveaway_donator == "1") {
                                append += '			<span class="header-icon donator-icon pull-right glyphicon glyphicon-gift" title="This user has donated items for a SteamTrade Matcher giveaway!"></span>';
                            }

                            if (userResults.info.player_info.friend.donator == "1") {
                                append += '			<span class="header-icon donator-icon pull-right glyphicon glyphicon-certificate" title="This user is a SteamTrade Matcher donator!"></span>';
                            }

                            tradeThem = '';
                            tradeYou = '';

                            var levelClass = '';
                            var levelTens = 10*Math.floor((userResults.info.player_info.friend.level%100)/10);

                            if (userResults.info.player_info.friend.level < 100) {
                                levelClass += 'lvl_' + levelTens;
                            } else {
                                levelClass += 'lvl_' + 100*Math.floor((userResults.info.player_info.friend.level)/100) + ' lvl_plus_' + levelTens;
                            }

                            append += '			<a href="' + userResults.info.player_info.friend.url + '" target="_blank">';
                            append += '				<div class="playerAvatar ' + userResults.info.player_info.friend.state + '">';
                            append += '					<img src="' + userResults.info.player_info.friend.avatar + '" />';
                            append += '				</div>';
                            append += '			</a>';
                            append += '			<div class="friendPlayerLevel ' + levelClass + '">';
                            append += '				<span class="friendPlayerLevelNum">' + userResults.info.player_info.friend.level + '</span>';
                            append += '			</div>';
                            append += '			<h1 class="panel-title match-username">' + userResults.info.player_info.friend.name + source_label + '</h1>';
                            append += '		</div>';
                            append += '		<div id="' + userResults.info.player_info.friend.steamid + '" class="panel-body">';
                            if (source == "quickmatch" && userResults.info.player_info.friend.trade_token === null) {
                                append += '<p>This user didn\'t submit his trade offer token. Please add him as a friend to offer a trade. <a href="'+userResults.info.player_info.friend.url+'">'+userResults.info.player_info.friend.url+'</a></p>';
                            } else {
                                var arrayTradeThem = new Array();
                                var arrayTradeYou = new Array();
                                $.each(userResults.found, function(app_key, app) {
                                    $.each(app.items, function(type_key, type) {
                                        if (Object.keys(type.user).length == Object.keys(type.friend).length) {
                                            $.each(type.user, function(user_item_key, user_item) {
                                                arrayTradeYou.push(user_item_key);
                                            });
                                            $.each(type.friend, function(friend_item_key, friend_item) {
                                                arrayTradeThem.push(friend_item_key);
                                            });
                                        } else if (Object.keys(type.user).length < Object.keys(type.friend).length) {
                                            matchCount = Object.keys(type.user).length;
                                            $.each(type.user, function(user_item_key, user_item) {
                                                arrayTradeYou.push(user_item_key);
                                            });
                                            var itemsArray = new Array();
                                            $.each(type.friend, function(friend_item_key, friend_item) {
                                                itemsArray.push({classid:friend_item_key, count:friend_item.count});
                                            });
                                            for (var i = 0; i < matchCount; i++) {
                                                highest = 0;
                                                highestIndex = null;
                                                highestClassID = null;
                                                $.each(itemsArray, function(item_array_key, item_array_value) {
                                                    if (item_array_value.count > highest) {
                                                        highest = item_array_value.count;
                                                        highestIndex = item_array_key;
                                                        highestClassID = item_array_value.classid;
                                                    }
                                                });
                                                arrayTradeThem.push(highestClassID);
                                                itemsArray.splice(highestIndex, 1);
                                            }
                                        } else if (Object.keys(type.user).length > Object.keys(type.friend).length) {
                                            matchCount = Object.keys(type.friend).length;
                                            var itemsArray = new Array();
                                            $.each(type.user, function(user_item_key, user_item) {
                                                itemsArray.push({classid:user_item_key, count:user_item.count});
                                            });
                                            for (var i = 0; i < matchCount; i++) {
                                                highest = 0;
                                                highestIndex = null;
                                                highestClassID = null;
                                                $.each(itemsArray, function(item_array_key, item_array_value) {
                                                    if (item_array_value.count > highest) {
                                                        highest = item_array_value.count;
                                                        highestIndex = item_array_key;
                                                        highestClassID = item_array_value.classid;
                                                    }
                                                });
                                                arrayTradeYou.push(highestClassID);
                                                itemsArray.splice(highestIndex, 1);
                                            }
                                            $.each(type.friend, function(friend_item_key, friend_item) {
                                                arrayTradeThem.push(friend_item_key);
                                            });
                                        }
                                    });
                                });
                                tradeThem = '/'+arrayTradeThem.join(";");
                                tradeYou = '/'+arrayTradeYou.join(";");

                                append += '			<a target="_blank" href="/action/startTradeOffer/' + userResults.info.player_info.friend.sid + '/' + url_trade_token + tradeThem + tradeYou + '">';
                                append += '				<div class="trade-button">Offer a trade to ' + userResults.info.player_info.friend.name + '</div>';
                                append += '			</a>';
                            }

                            $.each(userResults.found, function(app_key, app) {
                                if ($('#filter-box-game-' + app_key).length === 0) {
                                    $("#filter-box-no-results").hide();
                                    var added = false;
                                    var appendGameFilter = '<div class="col-sm-4 filter-box-item filter-box-game"><label><input type="checkbox" class="filter-box-game-checkbox" id="filter-box-game-'+app_key+'" value="'+app_key+'" checked="checked"><span class="count-filter-game count-filter-game-'+app_key+'">(1)</span> '+app.app_info.name+'</label></div>';
                                    $('.filter-box-game').each(function() {
                                        if ($(this).text().replace(/\(\d+\)\s{1}/,'') > app.app_info.name) {
                                            $(appendGameFilter).insertBefore($(this)).fadeIn("fast");
                                            added = true;
                                            return false;
                                        }
                                    })
                                    if(!added) $(appendGameFilter).appendTo($('#filter-box-games')).fadeIn("fast");
                                } else {
                                    var curVal = $('.count-filter-game-'+app_key).html().replace(/\(|\)/g,'');
                                    curVal++;
                                    $('.count-filter-game-'+app_key).html('('+ curVal + ')');
                                }

                                var appVisible = 'filter-show';
                                if ($.inArray(app_key, filteredGames) > -1) {
                                    appVisible = 'filter-hide';
                                }

                                //append += '<div class="matches match-'+app_key+'" style="display:'+appVisible+'">';
                                append += '<div class="matches match-'+app_key+' '+appVisible+'" data-app-id="'+app_key+'">';
                                append += '		<div class="match-container">';
                                append += '			<div class="app-image-container">';
                                if (app.app_info.header_image === null) {
                                    append += '			<img class="app-image" alt="' + app.app_info.name + '" src="/res/img/apps/unknown.jpg" />';
                                    append += '			<div class="app-name-on-image center-block">' + app.app_info.name + '</div>';
                                } else {
                                    append += '			<img class="app-image" alt="' + app.app_info.name + '" src="' + app.app_info.header_image + '" />';
                                    append += '			<div style="position: relative; width: 0; height: 0"><div class="app-name-behind-image">' + app.app_info.name + '</div></div>';
                                }
                                append += '				<div class="badge-link center-block"><a target="_blank" href="https://steamcommunity.com/my/gamecards/' + app.app_info.app_id + '/">View badge progress for this game</a></div>';
                                append += '			</div>';
                                $.each(app.items, function(type_key, type) {
                                    var typeString = type_key.replace(/ /g,'');

                                    var curVal = $('.count-filter-item-'+typeString).html().replace(/\(|\)/g,'');
                                    curVal++;
                                    $('.count-filter-item-'+typeString).html('('+ curVal + ')');

                                    var typeVisible = 'filter-show';
                                    if ($.inArray(typeString, filteredItems) > -1) {
                                        typeVisible = 'filter-hide';
                                    }
                                    append += '		<div class="user-match-container-global match-type-'+typeString+' '+typeVisible+'">';
                                    append += '			<div class="user-match-container">';
                                    append += '				<div class="match-owner user">You</div>';
                                    $.each(type.user, function(user_item_key, user_item) {
                                        var count = 0;
                                        if (user_item.count == user_item.fullcount) {
                                            count = user_item.count;
                                        } else {
                                            count = '<abbr title="You own this card ' + user_item.fullcount + ' times but you also have ' + (user_item.fullcount - user_item.count) + ' full set(s) ready to be crafted">' + user_item.count + '*</abbr>';
                                        }
                                        append += '				<div class="match">';
                                        append += '					<div class="item-thumbnail">';
                                        append += '						<img class="image-container" src="http://cdn.steamcommunity.com/economy/image/' + user_item.image + '"/>';
                                        append += '						<div class="thumbnail-count ' + user_item.rarity.toLowerCase() + '">' + count + '</div>';
                                        append += '					</div>';
                                        append += '					<div class="item-name">' + user_item.name + '</div>';
                                        append += '				</div>';
                                    });
                                    append += '			</div>';
                                    append += '			<span class="arrow glyphicon glyphicon-arrow-right"></span>';
                                    append += '			<div class="user-match-container">';
                                    append += '				<div class="match-owner friend">' + userResults.info.player_info.friend.name + '</div>';
                                    $.each(type.friend, function(friend_item_key, friend_item) {
                                        append += '				<div class="match">';
                                        append += '					<div class="item-thumbnail">';
                                        append += '						<img class="image-container" src="http://cdn.steamcommunity.com/economy/image/' + friend_item.image + '"/>';
                                        append += '						<div class="thumbnail-count ' + friend_item.rarity.toLowerCase() + '">' + friend_item.count + '</div>';
                                        append += '					</div>';
                                        append += '					<div class="item-name">' + friend_item.name + '</div>';
                                        append += '				</div>';
                                    });
                                    append += '			</div>';
                                    append += '		</div>';
                                });
                                append += '</div>';
                                append += '</div>';
                            });
                            append += '		</div>';
                            append += '</div>';
                            $("#match-results").append(append);

                            if ($('#'+userResults.info.player_info.friend.steamid).children().find('.user-match-container-global.filter-show').length == 0
                                || $('#'+userResults.info.player_info.friend.steamid).children('.matches.filter-show').length == 0) {
                                $('#'+userResults.info.player_info.friend.steamid).parent().removeClass("filter-show").addClass("filter-hide");
                            }

                            $('#'+userResults.info.player_info.friend.steamid).children('.matches.filter-show').each(function() {
                                if ($(this).children().find('.user-match-container-global.filter-show').length == 0) {
                                    $(this).removeClass("filter-show").addClass("filter-hide");
                                }
                            });

                        } else {
                            progressNoneFound++;
                        }
                    } else {
                        if (userResults.error == "PRIVATE_PROFILE") {
                            privateProfiles++;
                        } else {
                            progressError++;
                        }
                    }
                });
                $('body').dequeue();
            },
            error: function() {
                progressError++;
                $('body').dequeue();
            },
            complete: function() {
                $(".progress-bar-success").css('width', progressFound/$("#progress-total").html()*100 + '%');
                $(".progress-bar-info").css('width', progressNoneFound/$("#progress-total").html()*100 + '%');
                $(".progress-bar-warning").css('width', privateProfiles/$("#progress-total").html()*100 + '%');
                $(".progress-bar-danger").css('width', progressError/$("#progress-total").html()*100 + '%');
                $("#pg-success").html(progressFound);
                $("#pg-info").html(progressNoneFound);
                $("#pg-warning").html(privateProfiles);
                $("#pg-danger").html(progressError);
                //$("#progress-errors").html(progressError);
                $("#progress-value").html(progressCurrent);
                $("#progress-percent").html(Math.round(progressCurrent/$("#progress-total").html()*100));
                if ($('body').queue().length == 0) {
                    if (singleScan) {
                        $('#progress-div').slideUp();
                    }
                    if (progressFound == 0) {
                        if (singleScan) {
                            if (progressError == 1) {
                                $("#match-results").append('<div class="jumbotron"><span class="sad-smiley">:(</span><span class="no-results">An error occured during the scan. Please retry in a minute.</span></div>');
                            } else {
                                if (privateProfiles == 1) {
                                    $("#match-results").append('<div class="jumbotron"><span class="sad-smiley">:(</span><span class="no-results">Sorry, this user\'s inventory is set as private.</span></div>');
                                } else {
                                    $("#match-results").append('<div class="jumbotron"><span class="sad-smiley">:(</span><span class="no-results">Unfortunately, it looks like you have no duplicate items to trade with this user!</span></div>');
                                }
                            }
                        } else {
                            $("#match-results").append('<div class="jumbotron"><span class="sad-smiley">:(</span><span class="no-results">Unfortunately, no matches were found for you. Please try again later!</span></div>');
                        }
                    }
                    $('#loading-progress').fadeOut();
                }
            }
        });
    };
    top.getMatches = getMatches;
    top.fetchNextMatch = fetchNextMatch;
    top.compareInventories = compareInventories;
    savePublicProfiles();
})();
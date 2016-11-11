//= require jquery.autocomplete

$(document).ready(function() {
  var targetHouse = $("#action_page_congress_message_campaign_attributes_target_house");
  var targetSenate = $("#action_page_congress_message_campaign_attributes_target_senate");
  var targetSpecificLegislators = $("#action_page_congress_message_campaign_attributes_target_specific_legislators");
  var targetBioguideIds = $("#action_page_congress_message_campaign_attributes_target_bioguide_ids");
  var textReplacement = $("#congress_message_text_replacement_form_group");
  var targetCongress = targetHouse.add(targetSenate);

  if (!targetSpecificLegislators.is(":checked"))
    textReplacement.hide();

  targetBioguideIds.on("input", function() {
    targetCongress.prop("checked", false);
    targetSpecificLegislators.prop("checked", true);
    textReplacement.show();
  });

  targetSpecificLegislators.on("change", function() {
    if (this.checked) {
      targetCongress.prop("checked", false);
      textReplacement.show();
      targetBioguideIds.focus();
    } else {
      textReplacement.hide();
    }
  });

  targetCongress.on("change", function() {
    if (targetCongress.filter(":checked").length) {
      targetSpecificLegislators.prop("checked", false);
      textReplacement.hide();
    } else {
      targetSpecificLegislators.prop("checked", true);
      textReplacement.show();
      targetBioguideIds.focus();
    }
  });

  targetBioguideIds.autocomplete({
    serviceUrl: "/congress/search.json",
    delimiter: /\s*,\s*/,
    autoSelectFirst: true,
    transformResult: function(response, query) {
      var suggestions = $.parseJSON(response);
      for (var name, i=0; i < suggestions.length; ++i) {
        name = suggestions[i].first_name + " " + suggestions[i].last_name;
        suggestions[i].value = name + " (" + suggestions[i].bioguide_id + ")";
      }
      return { suggestions: suggestions };
    },
    onSelect: function(suggestion) {
      var targets = this.value.split(',');
      targets.pop();
      targets.push((targets.length ? ' ' : '') + suggestion.value);
      this.value = targets.join(',') + ', ';
      this.focus();
    }
  });

  // the campaign tag should mirror the title, unless changed
  // this is for tracking analytics and will be delivered to congress-forms
  var campaign_tag_changed = false;
  var $title = $('#action_page_title');
  var campaign_tag_selector = '#action_page_congress_message_campaign_attributes_campaign_tag';
  var $campaign_tag = $(campaign_tag_selector);
  if($title.val() != $campaign_tag.val())
    campaign_tag_changed = true;
  $title.keyup(function(e){
    var $campaign_tag = $(campaign_tag_selector);
    if(!campaign_tag_changed){
      $campaign_tag.val($title.val());
    }
  });
  $campaign_tag.on("change keyup",function(){
    campaign_tag_changed = true;
  });
});

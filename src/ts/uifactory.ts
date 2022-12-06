import { SubtitleOverlay } from './components/subtitleoverlay';
import { SettingsPanelPage } from './components/settingspanelpage';
import { SettingsPanelItem } from './components/settingspanelitem';
import { VideoQualitySelectBox } from './components/videoqualityselectbox';
import { PlaybackSpeedSelectBox } from './components/playbackspeedselectbox';
import { AudioTrackSelectBox } from './components/audiotrackselectbox';
import { AudioQualitySelectBox } from './components/audioqualityselectbox';
import { SettingsPanel } from './components/settingspanel';
import { SubtitleSettingsPanelPage } from './components/subtitlesettings/subtitlesettingspanelpage';
import { SettingsPanelPageOpenButton } from './components/settingspanelpageopenbutton';
import { SubtitleSettingsLabel } from './components/subtitlesettings/subtitlesettingslabel';
import { SubtitleSelectBox } from './components/subtitleselectbox';
import { ControlBar } from './components/controlbar';
import { Container } from './components/container';
import { PlaybackTimeLabel, PlaybackTimeLabelMode } from './components/playbacktimelabel';
import { SeekBar } from './components/seekbar';
import { SeekBarLabel } from './components/seekbarlabel';
import { PlaybackToggleButton } from './components/playbacktogglebutton';
import { VolumeToggleButton } from './components/volumetogglebutton';
import { VolumeSlider } from './components/volumeslider';
import { Spacer } from './components/spacer';
import { PictureInPictureToggleButton } from './components/pictureinpicturetogglebutton';
import { AirPlayToggleButton } from './components/airplaytogglebutton';
import { CastToggleButton } from './components/casttogglebutton';
import { VRToggleButton } from './components/vrtogglebutton';
import { SettingsToggleButton } from './components/settingstogglebutton';
import { FullscreenToggleButton } from './components/fullscreentogglebutton';
import { UIContainer } from './components/uicontainer';
import { BufferingOverlay } from './components/bufferingoverlay';
import { PlaybackToggleOverlay } from './components/playbacktoggleoverlay';
import { CastStatusOverlay } from './components/caststatusoverlay';
import { TitleBar } from './components/titlebar';
import { RecommendationOverlay } from './components/recommendationoverlay';
import { Watermark } from './components/watermark';
import { ErrorMessageOverlay } from './components/errormessageoverlay';
import { AdClickOverlay } from './components/adclickoverlay';
import { AdMessageLabel } from './components/admessagelabel';
import { AdSkipButton } from './components/adskipbutton';
import { CloseButton } from './components/closebutton';
import { MetadataLabel, MetadataLabelContent } from './components/metadatalabel';
import { PlayerUtils } from './playerutils';
import { Label } from './components/label';
import { CastUIContainer } from './components/castuicontainer';
import { UIConditionContext, UIManager } from './uimanager';
import { UIConfig } from './uiconfig';
import { PlayerAPI } from 'bitmovin-player';
import { i18n, LocalizableText } from './localization/i18n';
import { Button } from './components/button';
import { ListBox, SettingsPanelPageBackButton, SubtitleListBox } from './main';

export namespace UIFactory {

  export function buildDefaultUI(player: PlayerAPI, config: UIConfig = {}): UIManager {
    return UIFactory.buildModernUI(player, config);
  }

  export function buildDefaultSmallScreenUI(player: PlayerAPI, config: UIConfig = {}): UIManager {
    //return UIFactory.buildModernSmallScreenUI(player, config);
    return UIFactory.buildNPOUI(player, config);

  }

  export function buildDefaultCastReceiverUI(player: PlayerAPI, config: UIConfig = {}): UIManager {
    return UIFactory.buildModernCastReceiverUI(player, config);
  }

  export function modernUI() {
    let subtitleOverlay = new SubtitleOverlay();

    let mainSettingsPanelPage = new SettingsPanelPage({
      components: [
        new SettingsPanelItem(i18n.getLocalizer('settings.video.quality'), new VideoQualitySelectBox()),
        new SettingsPanelItem(i18n.getLocalizer('speed'), new PlaybackSpeedSelectBox()),
        new SettingsPanelItem(i18n.getLocalizer('settings.audio.track'), new AudioTrackSelectBox()),
        new SettingsPanelItem(i18n.getLocalizer('settings.audio.quality'), new AudioQualitySelectBox()),
      ],
    });

    let settingsPanel = new SettingsPanel({
      components: [
        mainSettingsPanelPage,
      ],
      hidden: true,
    });

    let subtitleSettingsPanelPage = new SubtitleSettingsPanelPage({
      settingsPanel: settingsPanel,
      overlay: subtitleOverlay,
    });

    const subtitleSelectBox = new SubtitleSelectBox();

    let subtitleSettingsOpenButton = new SettingsPanelPageOpenButton({
      targetPage: subtitleSettingsPanelPage,
      container: settingsPanel,
      ariaLabel: i18n.getLocalizer('settings.subtitles'),
      text: i18n.getLocalizer('open'),
    });

    mainSettingsPanelPage.addComponent(
      new SettingsPanelItem(
        new SubtitleSettingsLabel({
          text: i18n.getLocalizer('settings.subtitles'),
          opener: subtitleSettingsOpenButton,
        }),
        subtitleSelectBox,
        {
          role: 'menubar',
        },
      ));

    settingsPanel.addComponent(subtitleSettingsPanelPage);

    let controlBar = new ControlBar({
      components: [
        settingsPanel,
        new Container({
          components: [
            new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
            new SeekBar({ label: new SeekBarLabel() }),
            new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.TotalTime, cssClasses: ['text-right'] }),
          ],
          cssClasses: ['controlbar-top'],
        }),
        new Container({
          components: [
            new PlaybackToggleButton(),
            new VolumeToggleButton(),
            new VolumeSlider(),
            new Spacer(),
            new PictureInPictureToggleButton(),
            new AirPlayToggleButton(),
            new CastToggleButton(),
            new VRToggleButton(),
            new SettingsToggleButton({ settingsPanel: settingsPanel }),
            new FullscreenToggleButton(),
          ],
          cssClasses: ['controlbar-bottom'],
        }),
      ],
    });

    return new UIContainer({
      components: [
        subtitleOverlay,
        new BufferingOverlay(),
        new PlaybackToggleOverlay(),
        new CastStatusOverlay(),
        controlBar,
        new TitleBar(),
        new RecommendationOverlay(),
        new Watermark(),
        new ErrorMessageOverlay(),
      ],
      hideDelay: 2000,
      hidePlayerStateExceptions: [
        PlayerUtils.PlayerState.Prepared,
        PlayerUtils.PlayerState.Paused,
        PlayerUtils.PlayerState.Finished,
      ],
    });
  }

  export function modernAdsUI() {
    return new UIContainer({
      components: [
        new BufferingOverlay(),
        new AdClickOverlay(),
        new PlaybackToggleOverlay(),
        new Container({
          components: [
            new AdMessageLabel({ text: i18n.getLocalizer('ads.remainingTime')}),
            new AdSkipButton(),
          ],
          cssClass: 'ui-ads-status',
        }),
        new ControlBar({
          components: [
            new Container({
              components: [
                new PlaybackToggleButton(),
                new VolumeToggleButton(),
                new VolumeSlider(),
                new Spacer(),
                new FullscreenToggleButton(),
              ],
              cssClasses: ['controlbar-bottom'],
            }),
          ],
        }),
      ],
      cssClasses: ['ui-skin-ads'],
      hideDelay: 2000,
      hidePlayerStateExceptions: [
        PlayerUtils.PlayerState.Prepared,
        PlayerUtils.PlayerState.Paused,
        PlayerUtils.PlayerState.Finished,
      ],
    });
  }

  export function modernSmallScreenUI() {
    let subtitleOverlay = new SubtitleOverlay();

    let mainSettingsPanelPage = new SettingsPanelPage({
      components: [
        new SettingsPanelItem(i18n.getLocalizer('settings.video.quality'), new VideoQualitySelectBox()),
        new SettingsPanelItem(i18n.getLocalizer('speed'), new PlaybackSpeedSelectBox()),
        new SettingsPanelItem(i18n.getLocalizer('settings.audio.track'), new AudioTrackSelectBox()),
        new SettingsPanelItem(i18n.getLocalizer('settings.audio.quality'), new AudioQualitySelectBox()),
      ],
    });

    let settingsPanel = new SettingsPanel({
      components: [
        mainSettingsPanelPage,
      ],
      hidden: true,
      pageTransitionAnimation: false,
      hideDelay: -1,
    });

    let subtitleSettingsPanelPage = new SubtitleSettingsPanelPage({
      settingsPanel: settingsPanel,
      overlay: subtitleOverlay,
    });

    let subtitleSettingsOpenButton = new SettingsPanelPageOpenButton({
      targetPage: subtitleSettingsPanelPage,
      container: settingsPanel,
      ariaLabel: i18n.getLocalizer('settings.subtitles'),
      text: i18n.getLocalizer('open'),
    });

    const subtitleSelectBox = new SubtitleSelectBox();

    mainSettingsPanelPage.addComponent(
      new SettingsPanelItem(
        new SubtitleSettingsLabel({
          text: i18n.getLocalizer('settings.subtitles'),
          opener: subtitleSettingsOpenButton,
        }),
        subtitleSelectBox,
        {
          role: 'menubar',
        },
      ));

    settingsPanel.addComponent(subtitleSettingsPanelPage);

    settingsPanel.addComponent(new CloseButton({ target: settingsPanel }));
    subtitleSettingsPanelPage.addComponent(new CloseButton({ target: settingsPanel }));

    let controlBar = new ControlBar({
      components: [
        new Container({
          components: [
            new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
            new SeekBar({ label: new SeekBarLabel() }),
            new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.TotalTime, cssClasses: ['text-right'] }),
          ],
          cssClasses: ['controlbar-top'],
        }),
      ],
    });

    return new UIContainer({
      components: [
        subtitleOverlay,
        new BufferingOverlay(),
        new CastStatusOverlay(),
        new PlaybackToggleOverlay(),
        new RecommendationOverlay(),
        controlBar,
        new TitleBar({
          components: [
            new MetadataLabel({ content: MetadataLabelContent.Title }),
            new CastToggleButton(),
            new VRToggleButton(),
            new PictureInPictureToggleButton(),
            new AirPlayToggleButton(),
            new VolumeToggleButton(),
            new SettingsToggleButton({ settingsPanel: settingsPanel }),
            new FullscreenToggleButton(),
          ],
        }),
        settingsPanel,
        new Watermark(),
        new ErrorMessageOverlay(),
      ],
      cssClasses: ['ui-skin-smallscreen'],
      hideDelay: 2000,
      hidePlayerStateExceptions: [
        PlayerUtils.PlayerState.Prepared,
        PlayerUtils.PlayerState.Paused,
        PlayerUtils.PlayerState.Finished,
      ],
    });
  }

  export function modernSmallScreenAdsUI() {
    return new UIContainer({
      components: [
        new BufferingOverlay(),
        new AdClickOverlay(),
        new PlaybackToggleOverlay(),
        new TitleBar({
          components: [
            // dummy label with no content to move buttons to the right
            new Label({ cssClass: 'label-metadata-title' }),
            new FullscreenToggleButton(),
          ],
        }),
        new Container({
          components: [
            new AdMessageLabel({ text: 'Ad: {remainingTime} secs' }),
            new AdSkipButton(),
          ],
          cssClass: 'ui-ads-status',
        }),
      ],
      cssClasses: ['ui-skin-ads', 'ui-skin-smallscreen'],
      hideDelay: 2000,
      hidePlayerStateExceptions: [
        PlayerUtils.PlayerState.Prepared,
        PlayerUtils.PlayerState.Paused,
        PlayerUtils.PlayerState.Finished,
      ],
    });
  }

  export function modernCastReceiverUI() {
    let controlBar = new ControlBar({
      components: [
        new Container({
          components: [
            new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
            new SeekBar({ smoothPlaybackPositionUpdateIntervalMs: -1 }),
            new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.TotalTime, cssClasses: ['text-right'] }),
          ],
          cssClasses: ['controlbar-top'],
        }),
      ],
    });

    return new CastUIContainer({
      components: [
        new SubtitleOverlay(),
        new BufferingOverlay(),
        new PlaybackToggleOverlay(),
        new Watermark(),
        controlBar,
        new TitleBar({ keepHiddenWithoutMetadata: true }),
        new ErrorMessageOverlay(),
      ],
      cssClasses: ['ui-skin-cast-receiver'],
      hideDelay: 2000,
      hidePlayerStateExceptions: [
        PlayerUtils.PlayerState.Prepared,
        PlayerUtils.PlayerState.Paused,
        PlayerUtils.PlayerState.Finished,
      ],
    });
  }

  export function buildModernUI(player: PlayerAPI, config: UIConfig = {}): UIManager {
    // show smallScreen UI only on mobile/handheld devices
    let smallScreenSwitchWidth = 600;

    return new UIManager(player, [{
      ui: modernSmallScreenAdsUI(),
      condition: (context: UIConditionContext) => {
        return context.isMobile && context.documentWidth < smallScreenSwitchWidth && context.isAd
          && context.adRequiresUi;
      },
    }, {
      ui: modernAdsUI(),
      condition: (context: UIConditionContext) => {
        return context.isAd && context.adRequiresUi;
      },
    }, {
      ui: modernSmallScreenUI(),
      condition: (context: UIConditionContext) => {
        return !context.isAd && !context.adRequiresUi && context.isMobile
          && context.documentWidth < smallScreenSwitchWidth;
      },
    }, {
      ui: modernUI(),
      condition: (context: UIConditionContext) => {
        return !context.isAd && !context.adRequiresUi;
      },
    }], config);
  }

  export function buildModernSmallScreenUI(player: PlayerAPI, config: UIConfig = {}): UIManager {
    return new UIManager(player, [{
      ui: modernSmallScreenAdsUI(),
      condition: (context: UIConditionContext) => {
        return context.isAd && context.adRequiresUi;
      },
    }, {
      ui: modernSmallScreenUI(),
      condition: (context: UIConditionContext) => {
        return !context.isAd && !context.adRequiresUi;
      },
    }], config);
  }

  export function buildModernCastReceiverUI(player: PlayerAPI, config: UIConfig = {}): UIManager {
    return new UIManager(player, modernCastReceiverUI(), config);
  }

  export function buildNPOUI(player: PlayerAPI, config: UIConfig = {}): UIManager {
    return new UIManager(player, NPOUI(player), config);
  }

  export function NPOUI(player: PlayerAPI) {

    //npoplayer is the class used for making UI component references

    // Constants
    const interval = 10;
    const label_settings: LocalizableText = i18n.getLocalizer('settings');
    const label_videoquality: LocalizableText = i18n.getLocalizer('settings.video.quality');
    const label_speed: LocalizableText = i18n.getLocalizer('speed');
    const label_subtitles: LocalizableText = i18n.getLocalizer('settings.subtitles');
    const label_audioquality: LocalizableText = i18n.getLocalizer('settings.audio.quality');
    const label_audiotrack: LocalizableText = i18n.getLocalizer('settings.audio.track');
    const label_auto: LocalizableText = i18n.getLocalizer('auto');

    ///////////////////////////////////////////////
    // Big buttons Small Screen
    ///////////////////////////////////////////////

    let bigPlayToggle = new PlaybackToggleButton({cssClass:'ui-playbacktogglebutton'});
    let bigRewindButton = new Button({cssClass: 'ui-rewindbutton bmpui-ui-button'});
    let bigForwardButton = new Button({cssClass: 'ui-forwardbutton bmpui-ui-button'});

    function rewind() {
        if(player!=null){
            if(player.isLive()){
                player.timeShift(player.getTimeShift() - interval);
            }else{
                player.seek(Math.max(0, player.getCurrentTime() - interval));
            }
        }
    }

    function forward() {
        if(player!=null){
            if(player.isLive()){
                player.timeShift(Math.min(0,player.getTimeShift() + interval));
            }else{
                player.seek(Math.min(player.getDuration(), player.getCurrentTime() + interval));
            }
        }
    }

    let rewindButton = new Button({cssClass: 'ui-rewindbutton bmpui-ui-button'});
    rewindButton.onClick.subscribe(rewind);
    bigRewindButton.onClick.subscribe(rewind);

    let forwardButton = new Button({cssClass: 'ui-forwardbutton bmpui-ui-button'});
    forwardButton.onClick.subscribe(forward);
    bigForwardButton.onClick.subscribe(forward);

    let middleButtons = new ControlBar({
        components: [
            bigRewindButton,
            bigPlayToggle,
            bigForwardButton
        ],
        cssClasses: ['controlbar-middle'],
    });

    ///////////////////////////////////////////////
    // Settings Panel
    ///////////////////////////////////////////////
    let subtitleListBox = new SubtitleListBox();
    let speedListBox = new ListBox({items:[{key:'0.25',label:'0.25x'},{key:'0.5',label:'0.5x'},{key:'1',label:'1x'},{key:'1.5',label:'1.5x'},{key:'2',label:'2x'}]});
    let qualityListBox = new ListBox();

    subtitleListBox.onItemSelected.subscribe((e)=>{
        e.getItems().forEach(function(item){
            if(item.key == e.getSelectedItem()){
                subtitleSettingsOpenButton.setText(item.label);
            }
        });
        setTimeout(()=>{settingsPanel.setActivePage(mainSettingsPage);},100);
    });

    speedListBox.selectItem('1');
    speedListBox.onItemSelected.subscribe((source,args)=>{
        source.getItems().forEach(function(item){
            if(item.key == args){
                player?.setPlaybackSpeed(parseFloat(item.key));
                speedSettingsOpenButton.setText(item.label);
                speedListBox.selectItem(item.key);
            }
        });

        setTimeout(()=>{settingsPanel.setActivePage(mainSettingsPage);},100);
    });

    qualityListBox.selectItem('auto');
    qualityListBox.onItemSelected.subscribe((source,args)=>{
        source.getItems().forEach(function(item){
            if(item.key == args){
                player?.setVideoQuality(item.key);
                qualitySettingsOpenButton.setText(item.label);
                qualityListBox.selectItem(item.key);
            }
        });
        setTimeout(()=>{settingsPanel.setActivePage(mainSettingsPage);},100);
    });

    let subtitlePanelPage = new SettingsPanelPage({
        components: [
            new Button({cssClass:'settings-trigger'}),
            new SettingsPanelItem('', subtitleListBox),
        ],
        cssClasses: ['listbox-panel']
    });

    let speedPanelPage = new SettingsPanelPage({
        components: [
            new Button({cssClass:'settings-trigger'}),
            new SettingsPanelItem('', speedListBox),
        ],
        cssClasses: ['listbox-panel']
    });


    let qualityPanelPage = new SettingsPanelPage({
        components: [
            new Button({cssClass:'settings-trigger'}),
            new SettingsPanelItem('', qualityListBox),
        ],
        cssClasses: ['listbox-panel']
    });

    let settingsTriggerButton = new Button({cssClass:'settings-trigger'});

    let mainSettingsPage = new SettingsPanelPage({
        components: [
            settingsTriggerButton,
            new Label({text: label_settings, cssClass:'setting-header'}),
            new SettingsPanelItem(label_audioquality, new AudioQualitySelectBox()),
            new SettingsPanelItem(label_audiotrack, new AudioTrackSelectBox()),
        ],
        cssClasses: ['main-panel']

    });

    mainSettingsPage.onActive.subscribeOnce(function(){
        qualityListBox.addItem('auto', label_auto);
        player?.getAvailableVideoQualities().forEach(function(quality){
            qualityListBox.addItem(quality.id,quality.label??'test');
        });
        qualityListBox.selectItem('auto');
    });
    
    let settingsPanel = new SettingsPanel({
        components: [
            mainSettingsPage,
            subtitlePanelPage,
            speedPanelPage,
            qualityPanelPage
        ],
        hidden: true,
        pageTransitionAnimation: false,
    });

    let subtitleSettingsOpenButton = new SettingsPanelPageOpenButton({
        targetPage: subtitlePanelPage,
        container: settingsPanel,
        text: 'Nederlands',
        cssClasses: ['listbox-pager-button'],
    });

    let speedSettingsOpenButton = new SettingsPanelPageOpenButton({
        targetPage: speedPanelPage,
        container: settingsPanel,
        text: '1x',
        cssClasses: ['listbox-pager-button']
    });

    let qualitySettingsOpenButton = new SettingsPanelPageOpenButton({
        targetPage: qualityPanelPage,
        container: settingsPanel,
        text: 'automatisch',
        cssClasses: ['listbox-pager-button']
    });

    //BACK BUTTONS
    let settingsBackButton_subtitles = new SettingsPanelPageBackButton({
        targetPage: mainSettingsPage,
        container: settingsPanel,
        text: 'Ondertiteling',
        cssClasses: ['settings-back-button']
    });

    let settingsBackButton_speed = new SettingsPanelPageBackButton({
        targetPage: mainSettingsPage,
        container: settingsPanel,
        text: 'Snelheid',
        cssClasses: ['settings-back-button']
    });

    let settingsBackButton_quality = new SettingsPanelPageBackButton({
        targetPage: mainSettingsPage,
        container: settingsPanel,
        text: 'Kwaliteit',
        cssClasses: ['settings-back-button']
    });

    let subtitlesPanelItem = new SettingsPanelItem(label_subtitles, subtitleSettingsOpenButton, {hidden:true});
    let speedPanelItem = new SettingsPanelItem(label_speed, speedSettingsOpenButton);
    let qualityPanelItem = new SettingsPanelItem(label_videoquality, qualitySettingsOpenButton, {hidden:true});
            
    mainSettingsPage.addComponent(subtitlesPanelItem);
    mainSettingsPage.addComponent(speedPanelItem);
    mainSettingsPage.addComponent(qualityPanelItem);
    subtitlePanelPage.addComponent(settingsBackButton_subtitles);
    speedPanelPage.addComponent(settingsBackButton_speed);
    qualityPanelPage.addComponent(settingsBackButton_quality);

    let subtitleOverlay = new SubtitleOverlay();

    ///////////////////////////////////////////////
    // Error Message Overlay
    ///////////////////////////////////////////////

    let errorMessageOverlay = new ErrorMessageOverlay();
    // npoplayer.uiComponents.errorMessageOverlay = errorMessageOverlay;

    ///////////////////////////////////////////////
    // Call To Action buttons
    ///////////////////////////////////////////////

    let skipIntroButton = new Button({cssClass: 'ui-textbutton ui-skipintrobutton bmpui-ui-button bmpui-hidden', text: 'Intro overslaan', hidden:true});
    skipIntroButton.onClick.subscribe(() => {
        if(player!=null){
            if(true){ //TODO Check if metadata has intro data
                player.seek(96);
            }
        }
    });

    let goBackLiveButton = new Button({cssClass: 'ui-textbutton ui-backtolivebutton bmpui-ui-button', text: 'Terug naar live', hidden:true});
    goBackLiveButton.onClick.subscribe(() => {
        if(player!=null){
            if(player.isLive()){
                player.timeShift(0);
            }
        }
    });

    let ctaBar = new Container({
        components: [
            skipIntroButton,
            goBackLiveButton,
        ],
        cssClasses: ['controlbar-textbuttons'],
    });

    ///////////////////////////////////////////////
    // UI Bars
    ///////////////////////////////////////////////
    let topBar = new TitleBar({
        components: [
            new Container({
                components: [
                    new PictureInPictureToggleButton(),
                    new AirPlayToggleButton(),
                    new CastToggleButton(),
                    new VRToggleButton(),
                    new SettingsToggleButton({ settingsPanel: settingsPanel}),
                    new FullscreenToggleButton(),
                ],
                cssClasses: ['controlbar-top','controlbar-small'],
            }),
        ],
        cssClasses: ['titlebar-small']
    });

    let controlBar = new ControlBar({
        components: [

            settingsPanel,
            new Container({
                components: [
                    new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.CurrentTime, hideInLivePlayback: true }),
                    new SeekBar({ label: new SeekBarLabel() }),
                    new PlaybackTimeLabel({ timeLabelMode: PlaybackTimeLabelMode.TotalTime, cssClasses: ['text-right'] }),
                ],
                cssClasses: ['controlbar-top'],
            }),
            new Container({
                components: [
                    new PlaybackToggleButton(),
                    new VolumeToggleButton(),
                    new VolumeSlider(),
                    rewindButton,
                    forwardButton,
                    new Spacer(),
                    new PictureInPictureToggleButton(),
                    new AirPlayToggleButton(),
                    new CastToggleButton(),
                    new VRToggleButton(),
                    new SettingsToggleButton({ settingsPanel: settingsPanel }),
                    new FullscreenToggleButton(),
                ],
                cssClasses: ['controlbar-bottom'],
            }),
        ],
    });

    let nicam = new Label({text: '', cssClass:'nicam'});
    let titleBar = new TitleBar({cssClasses:['metadata']});
    titleBar.addComponent(nicam);

    ///////////////////////////////////////////////
    // Default UI
    ///////////////////////////////////////////////
    return new UIContainer({
        components: [
            subtitleOverlay,
            new BufferingOverlay(),
            new PlaybackToggleOverlay(),
            new CastStatusOverlay(),
            middleButtons,
            controlBar,
            topBar,
            ctaBar,
            titleBar,
            new RecommendationOverlay(),
            new Watermark(),
            errorMessageOverlay,
        ],
        // hideDelay: -1,
    });


  }
}

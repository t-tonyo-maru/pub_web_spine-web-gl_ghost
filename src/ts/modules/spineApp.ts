import * as spine from '@esotericsoftware/spine-webgl'

// https://github.com/EsotericSoftware/spine-runtimes/blob/4.1/spine-ts/spine-webgl/example/mix-and-match.html

export class SpineApp implements spine.SpineCanvasApp {
  private skeleton: unknown // type: spine.Skeleton
  private state: unknown // type: spine.AnimationState

  loadAssets = (canvas: spine.SpineCanvas) => {
    // atlas ファイルをロード
    canvas.assetManager.loadTextureAtlas('model.atlas')
    // skeleton(json 形式) をロード
    canvas.assetManager.loadJson('model.json')
  }

  initialize = (canvas: spine.SpineCanvas) => {
    // spine のアセットマネージャーを取得
    const assetManager = canvas.assetManager

    // テクスチャアトラスを生成
    const atlas = canvas.assetManager.require('model.atlas')
    // AtlasAttachmentLoader（リージョン、メッシュ、バウンディングボックス、パスのアタッチメントを解決するための要素）を生成
    const atlasLoader = new spine.AtlasAttachmentLoader(atlas)
    // skeleton(json 形式) を読み込むためのオブジェクトを生成
    const skeltonJson = new spine.SkeletonJson(atlasLoader)
    // skeleton(json 形式) を読み込む
    const skeltonData = skeltonJson.readSkeletonData(
      assetManager.require('model.json')
    )
    // skeleton インスタンスを生成
    this.skeleton = new spine.Skeleton(skeltonData)

    if (this.skeleton instanceof spine.Skeleton) {
      // skeleton の位置を画面中央にセット
      this.skeleton.x = 0
      this.skeleton.y = (-1 * Math.floor(this.skeleton.data.height)) / 2
      // skeleton の大きさを等倍でセット
      this.skeleton.scaleX = 1
      this.skeleton.scaleY = 1
    }

    // skeleton(json ファイル)からアニメーション情報を取得
    const stateData = new spine.AnimationStateData(skeltonData)
    // アニメーションをセット
    this.state = new spine.AnimationState(stateData)
    if (this.state instanceof spine.AnimationState) {
      this.state.setAnimation(0, 'animation', true)
    }
  }

  update = (canvas: spine.SpineCanvas, delta: number) => {
    if (!(this.skeleton instanceof spine.Skeleton)) return
    if (!(this.state instanceof spine.AnimationState)) return

    // アニメーションを更新
    this.state.update(delta)
    this.state.apply(this.skeleton)
    this.skeleton.updateWorldTransform()
  }

  render = (canvas: spine.SpineCanvas) => {
    if (!(this.skeleton instanceof spine.Skeleton)) return

    // レンダリング制御
    const renderer = canvas.renderer
    // 画面リサイズ
    renderer.resize(spine.ResizeMode.Expand)
    // 画面クリア
    canvas.clear(0.2, 0.2, 0.2, 1)
    // 描画開始
    renderer.begin()
    // skeleton を画面に描画
    renderer.drawSkeleton(this.skeleton)
    // 描画終了
    renderer.end()
  }

  error = (canvas: spine.SpineCanvas) => {
    // エラーがあれば、以降が発火する
    console.log('error!!')
    console.log(canvas)
  }
}

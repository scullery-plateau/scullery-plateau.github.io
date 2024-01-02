namespace("sp.yoga-proto.YogaProto",{
  "sp.yoga-proto.PoseData": "PoseData",
  "sp.yoga-proto.PoseSelector": "PoseSelector",
  "sp.common.Colors":"Colors",
  "sp.common.Dialog":"Dialog",
  "sp.common.Utilities":"util",
},({ PoseData, Colors, Dialog, util }) => {
  const defaultParams = {
    poseCount: 7,
    breathColor: "#0000ff",
    poseColor: "#00ff00"
  };
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = util.merge(PoseData, defaultParams, props.urlParams);
      this.modals = Dialog.factory({
        poseSelector: {
          componentClass: PoseSelector,
          attrs: { class: 'rpg-box text-light w-75' },
          onClose:(selected) => {
            this.setState({ selected });
          }
        }
      });
    }
    applyWorkout() {
      //todo
    }
    render() {
      return <>
        <h2 className="text-center">Yoga Workout</h2>
        { !this.state.selected && <div className="d-flex justify-content-center">
            <button className="btn btn-success" onClick={() => this.modals.poseSelector.open({})}>Select Poses</button>
          </div>}
        { this.state.selected && !this.state.workout && <div className="d-flex justify-content-center">
            <button className="btn btn-success" onClick={() => this.modals.applyWorkout()}>Begin Workout</button>
          </div>}
        { this.state.workout && this.state.workoutStep < this.state.workout.length && <div className="d-flex flex-column">
            <div className="progress w-100 m-1">
              <div className="progress-bar"
                   id="poseProgress"
                   style={{
                    width: "0%",
                    color: Colors.getForegroundColor(this.state.poseColor),
                    backgroundColor: this.state.poseColor,
                   }}
                >Pose</div>
            </div>
            <div className="progress w-100 m-1">
              <div className="progress-bar"
                   id="breathProgress"
                   style={{
                    width: "0%",
                    color: Colors.getForegroundColor(this.state.breathColor),
                    backgroundColor: this.state.breathColor,
                   }}
                >Breathe</div>
            </div>
            <div>
              {
                // display image
              }
            </div>
          </div>}
        { this.state.workout && this.state.workoutStep >= this.state.workout.length && <div className="d-flex flex-columns">
            <div className="d-flex justify-content-center">
              <p>Your workout is complete</p>
            </div>
            <div className="d-flex justify-content-center">
              <button className="btn btn-success" onClick={() => this.setState({ workoutStep: 0})}>Repeat Workout</button>
            </div>
            <div className="d-flex justify-content-center">
              <button className="btn btn-success" onClick={() => this.setState({ workoutStep: undefined, workout: undefined })}>Reshuffle Selected Poses</button>
            </div>
            <div className="d-flex justify-content-center">
              <button className="btn btn-success" onClick={() => this.setState({ workoutStep: undefined, workout: undefined, selected: undefined })}>Reselect Poses</button>
            </div>
          </div>}
      </>;
    }
  }
});
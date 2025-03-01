module.exports = {
    apps: [
      {
        name: "RhinoTime",
        script: "npm",
        args: "run dev",
        env: {
          NODE_ENV: "development"
        }
      }
    ]
}
  
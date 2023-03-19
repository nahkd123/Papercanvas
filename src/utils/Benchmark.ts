export namespace Benchmark {
    export function start(cb: (stage: (name: string) => void) => any) {
        let runTime = 0, stageTime = 0;
        let stage = (name: string) => {
            let now = performance.now();
            console.log(`[Benchmark] ${name} +${now - stageTime}ms (${now - runTime}ms in total)`);
            stageTime = now;
        };

        runTime = stageTime = performance.now();
        cb(stage);
        console.log(`[Benchmark] Benchmark done! (${performance.now() - runTime}ms runtime)`);
        return performance.now() - runTime;
    }
}
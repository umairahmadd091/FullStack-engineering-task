# FullStack-engineering-task

Feedback: Candidate is using async.parallel and then async/await both in a task2. Should try to use async/parallel only.

Explaination: Without async/await network response cannot be manage, async.parallel is managing the overall process. for individual process like Fetch, async/await is neccessary.

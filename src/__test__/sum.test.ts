
function sum (a:number,b:number){
    return a+b;
}

test("sum is 5",()=>{
    expect(sum(3,2)).toBe(5)
})
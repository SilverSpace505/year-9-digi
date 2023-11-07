
function rv2(x, y, rot) {
    return {x: x*Math.sin(rot) + y*Math.sin(rot+Math.PI/2), y: x*Math.cos(rot) + y*Math.cos(rot+Math.PI/2)}
}

// function findIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
//     const slope1 = (y2 - y1) / (x2 - x1)
//     const yIntercept1 = y1 - slope1 * x1

//     const slope2 = (y4 - y3) / (x4 - x3)
//     const yIntercept2 = y3 - slope2 * x3

//     const x = (yIntercept2 - yIntercept1) / (slope1 - slope2)
//     const y = slope1 * x + yIntercept1

//     return (0 < x < 1 && 0 < y < 1)
// }

// * Random Code i found on the intenet *
function findIntersection(a,b,c,d,p,q,r,s) {
    var det, gamma, lambda
    det = (c - a) * (s - q) - (r - p) * (d - b)
    if (det === 0) {
        return false
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)
    }
}

function lineInMap(x1, y1, x2, y2) {
    for (let m of map) {
        let i3 = 0
        for (let l of m) {
            let i4 = i3 + 1
            if (i4 >= m.length) {
                continue
            }
            if (findIntersection(
                x1, y1,
                x2, y2,
                l[0], l[1],
                m[i4][0], m[i4][1]
            )) {
                return true
            }
            i3++
        }
    }
    return false
}

// * Your Code *
// function findIntersection(x1, y1, x2, y2, x3, y3, x4, y4){
//     let p1 = {x: x1, y: y1}
//     let p2 = {x: x2, y: y2}
//     let p3 = {x: x3, y: y3}
//     let p4 = {x: x4, y: y4}

//     // Find centrepoints:
//     var pa = {x:(p1.x+p2.x)/2,y:(p1.y+p2.y)/2};
//     var pb = {x:(p3.x+p4.x)/2,y:(p3.y+p4.y)/2};

//     // Parallel axes

//     let dotProduct = Math.abs((p2.x-p1.x)*(p4.x-p3.x)+(p2.y-p1.y)*(p4.y-p3.y));
//     let dotProductAtoA = Math.abs((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p2.y));
//     let dotProductBtoB = Math.abs((p4.x-p3.x)*(p4.x-p3.x)+(p4.y-p3.y)*(p4.y-p3.y));


//     let dotProductPAtoPBwithlineA = Math.abs((p2.x-p1.x)*(pb.x-pa.x)+(p2.y-p1.y)*(pb.y-pa.y))
//     let dotProductPAtoPBwithlineB = Math.abs((pb.x-pa.x)*(p4.x-p3.x)+(pb.y-pa.y)*(p4.y-p3.y))

//     // Perpendicular axes

//     let dotProductP = Math.abs((p2.y-p1.y)*(p4.x-p3.x)-(p2.x-p1.x)*(p4.y-p3.y));

//     let dotProductPAtoPBwithlineAP = Math.abs((p2.y-p1.y)*(pb.x-pa.x)-(p2.x-p1.x)*(pb.y-pa.y))
//     let dotProductPAtoPBwithlineBP = Math.abs((pb.x-pa.x)*(p4.y-p3.y)-(pb.y-pa.y)*(p4.x-p3.x))

//     if( dotProduct/2+dotProductAtoA>=dotProductPAtoPBwithlineA&&dotProduct/2+dotProductBtoB>=dotProductPAtoPBwithlineB
//         &&dotProductP/2>=dotProductPAtoPBwithlineAP&&dotProductP/2>=dotProductPAtoPBwithlineBP){
//         return(true);
//     }else{
//         return(false);
//     }
// }


// function findIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
//   let slope1 = (y2-y1) / (x2-x1)
//   let slope2 = (y4-y3) / (x4-x3)
//   let s = (y3 - slope2*(x3-x1) + x1) / (slope1-slope2)
//   let t = s + x3-x1 
//   console.log(x2-x1, t)
//   // console.log(s, t)
//   if (x2-x1 > 0) {
//     if (t > 0 && t < x2-x1) {
//       if (x4-x3 > 0) {
//         if (s > 0 && s < x4-x3) {
//           return true
//         }
//       } else {
//         if (s < 0 && s < x4-x3) {
//           return true
//         }
//       }
//     }
//   } else {
//     if (t < 0 && t < x2-x1) {
//       if (x4-x3 > 0) {
//         if (s > 0 && s < x4-x3) {
//           return true
//         }
//       } else {
//         if (s < 0 && s < x4-x3) {
//           return true
//         }
//       }
//     }
//   }
 
//   return false
// }
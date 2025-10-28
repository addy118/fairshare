import { Request, Response } from "express";
import Group from "../queries/Group";
import Split from "../queries/Split";
import User from "../queries/User";
import { calculateSplits, mergeChrono, getGroupBalance } from "./util";
import { SplitStd } from "../types";
import puppeteer from "puppeteer";

export const postExportGrpHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { groupId, html, css } = req.body;

    if (!html || !css) {
      res.status(400).json({ message: "Missing HTML or CSS content" });
      return;
    }

    let browser;
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();
    const fullHtml = `
    <!DOCTYPE html>
      <html lang="en" class="dark">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${css}
            div, p, section {
              page-break-inside: auto !important;
            }

            h1, h2, h3 {
              page-break-after: avoid;
            }
          </style>
        </head>
        <body style="background: #09090b; padding: 1.5rem; min-height: 100vh; box-sizing: border-box;">
          ${html}
        </body>
      </html>
    `;
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    await page.emulateMediaType("print");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // important for your background colors
      // margin: {
      //   top: "20px",
      //   bottom: "20px",
      //   right: "20px",
      //   left: "20px",
      // },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${groupId}-payment-history.pdf"`
    );

    res.status(200).end(pdfBuffer);
    await browser.close();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in postExportGrpHistory(): ", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Failed to export history" });
    }
  }
};

export const postGrp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const group = await Group.create(name);
    if (!group) throw new Error("Unable to fetch group");
    res.json({ message: "success", group });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in postGrp(): ", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Failed to create group" });
    }
  }
};

export const postDelGrp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { groupId } = req.params;
    await Group.delete(Number(groupId));
    res.json({ message: "success" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in postDelGrp(): ", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Failed to delete group" });
    }
  }
};

export const postMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { groupId } = req.params;
    const { username } = req.body;

    const userId = await User.getIdbyUserName(username);
    if (!userId) throw new Error("Can't find the user.");

    await Group.join(userId, Number(groupId));
    res.json({ message: "success" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in postMember(): ", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Failed to add user to group." });
    }
  }
};

export const deleteMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { groupId, memberId } = req.params;
    if (!memberId) throw new Error("Unable to fetch member ID.");
    if (!groupId) throw new Error("Unable to fetch group ID.");
    await Group.leave(memberId, Number(groupId));
    res.json({ message: "success" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in deleteMember(): ", error.message);
      console.error(error.stack);
      res.status(400).json({
        message: error.message || "Failed to remove member from group",
      });
    }
  }
};

export const getGrpInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { grpId } = req.params;
    const group = await Group.getById(Number(grpId));
    if (!group) throw new Error("Unable to fetch group");
    res.json(group);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getGrpInfo(): ", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Failed to retrieve group info" });
    }
  }
};

export const getAllExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { grpId } = req.params;
    const group = await Group.expenses(Number(grpId));
    if (!group) throw new Error("Unable to fetch group");
    res.json(group);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getAllExpenses(): ", error.message);
      console.error(error.stack);
      res.status(400).json({
        message: error.message || "Failed to retrieve group expenses",
      });
    }
  }
};

export const getGrpBalance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { grpId } = req.params;
    const rawBalance = await getGroupBalance(Number(grpId));

    const balance = await Promise.all(
      Object.entries(rawBalance).map(async ([userId, amount]) => ({
        user: {
          id: userId,
          name: await User.getNameById(userId),
        },
        amount: Number(amount),
      }))
    );

    res.json(balance);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getGrpBalance(): ", error.message);
      console.error(error.stack);
      res.status(400).json({
        message: error.message || "Failed to calculate group balance",
      });
    }
  }
};

export const getSplits = async (req: Request, res: Response): Promise<void> => {
  try {
    const { grpId } = req.params;
    const splits = await Group.splits(Number(grpId));
    if (!splits) throw new Error("Unable to fetch splits");
    res.json(splits);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getSplits(): ", error.message);
      console.error(error.stack);
      res.status(400).json({
        message: error.message || "Failed to retrieve splits information",
      });
    }
  }
};

export const getMinSplits = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { grpId } = req.params;

    // get the current group balance for optimizing purpose
    const balance = await getGroupBalance(Number(grpId), true);
    if (!balance) throw new Error("Unable to fetch balance.");
    // console.log("Initial Balance: ", balance);

    // THE CORE THING: get the splits based on the current group balance
    const newSplits = calculateSplits(balance);
    // console.log("Raw Optimized Splits: ", newSplits);

    // transform the response to push in db
    const splitsArr: SplitStd[] = newSplits.map((split) => {
      return {
        name: "Optimized Split",
        groupId: Number(grpId),
        debtorId: split[0],
        creditorId: split[1],
        amount: Number(split[2]),
      };
    });
    // console.log("Splits Array: ", splitsArr);

    // delete all the previous "redundant splits"
    await Split.deleteAll(Number(grpId));

    // push new optimized splits in db
    await Split.createMany(splitsArr);

    // get the splits from the group with debtor & creditor details
    const minSplits = await Group.splits(Number(grpId));
    if (!minSplits) throw new Error("Unable to fetch minimum splits.");
    // console.log("Final Optimized Splits: ", minSplits);

    res.json(minSplits);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getMinSplits(): ", error.message);
      console.error(error.stack);
      res.status(400).json({
        message:
          error.message || "Failed to calculate and update optimized splits",
      });
    }
  }
};

export const getGrpHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { groupId } = req.params;

    const members = await Group.members(Number(groupId));
    if (!members) throw new Error("Unable to fetch members.");

    const expenses = await Group.expenseHistory(Number(groupId));
    if (!expenses) throw new Error("Unable to fetch expenses.");

    const splits = await Group.splitsHistory(Number(groupId));
    if (!splits) throw new Error("Unable to fetch splits.");

    // merge chronologically all the expenses and splits
    const timeline = mergeChrono(expenses, splits);

    // initialize balance as 0 for all members
    // const balance: Record<string, number> = {};
    const balance: any = {};
    members.forEach((mem) => (balance[mem.member.id] = 0));

    // update balance after each payment
    for (const entry of timeline) {
      // past expense
      if (entry.type == "expense") {
        const totalPeople = entry.payers.length;
        const share = Math.floor(entry.totalAmt / totalPeople);

        entry.payers.forEach(({ payer, paidAmt }) => {
          balance[payer.id] += paidAmt - share;
        });
      }

      // past split
      else if (entry.type == "split") {
        // IMPORTANT: amounts are always positive
        // NOTE: BEWARE OF +VE/-VE SIGNS
        balance[entry.debtor.id] += entry.amount;
        balance[entry.creditor.id] -= entry.amount;
      }

      // accumulate balance and convert to array of objects
      entry.balance = await Promise.all(
        Object.entries(balance).map(async ([userId, amount]) => ({
          user: {
            id: userId,
            name: await User.getNameById(userId),
            pfp: await User.getPfpById(userId),
          },
          amount: Number(amount),
        }))
      );
    }

    res.json(timeline);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getGrpHistory(): ", error.message);
      console.error(error.stack);
      res
        .status(400)
        .json({ message: error.message || "Failed to retrieve group history" });
    }
  }
};
